const { body, validationResult, query } = require('express-validator');
const Blog = require('../models/Blog');
const { uploadBlogImage, handleMulterError, getFileUrl, deleteFile } = require('../config/multer');
const path = require('path');
const { isLoggedIn } = require('./authController');

const isAuthorOrAdmin = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.author.toString() === req.user._id.toString() || req.user.role === 'admin') {
      req.blog = blog;
      return next();
    }

    res.status(403).json({ success: false, message: 'Access denied' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const blogValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('excerpt').optional().trim().isLength({ min: 1, max: 300 }).withMessage('Excerpt must be less than 300 characters'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('category').optional().isIn(['yoga', 'meditation', 'fitness', 'nutrition', 'wellness', 'lifestyle']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
];

const getAllBlogs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const tags = req.query.tags ? req.query.tags.split(',').map(tag => tag.trim()) : null;

    const options = { category, tags, limit, skip, sort: { publishedAt: -1 } };
    const blogs = await Blog.findPublished(options);
    const total = await Blog.countDocuments({
      isPublished: true,
      ...(category && { category }),
      ...(tags && { tags: { $in: tags } })
    });

    const blogsWithUrls = blogs.map(blog => {
      const blogData = blog.getPublicData();
      if (blogData.featuredImg) blogData.featuredImg = getFileUrl(req, blogData.featuredImg, 'blogs');
      if (blogData.author && blogData.author.profilePhoto) {
        blogData.author.profilePhoto = getFileUrl(req, blogData.author.profilePhoto, 'profiles');
      }
      return blogData;
    });

    res.json({
      success: true,
      blogs: blogsWithUrls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs', error: error.message });
  }
};

const searchBlogs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.searchBlogs(searchQuery, { limit, skip });
    const searchRegex = new RegExp(searchQuery, 'i');
    const total = await Blog.countDocuments({
      isPublished: true,
      $or: [{ title: searchRegex }, { excerpt: searchRegex }, { tags: searchRegex }]
    });

    const blogsWithUrls = blogs.map(blog => {
      const blogData = blog.getPublicData();
      if (blogData.featuredImg) blogData.featuredImg = getFileUrl(req, blogData.featuredImg, 'blogs');
      if (blogData.author && blogData.author.profilePhoto) {
        blogData.author.profilePhoto = getFileUrl(req, blogData.author.profilePhoto, 'profiles');
      }
      return blogData;
    });

    res.json({
      success: true,
      blogs: blogsWithUrls,
      searchQuery,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed', error: error.message });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('author', 'firstName lastName profilePhoto');

    const total = await Blog.countDocuments({ author: req.user._id });

    const blogsWithUrls = blogs.map(blog => {
      const blogData = blog.getPublicData();
      if (blogData.featuredImg) blogData.featuredImg = getFileUrl(req, blogData.featuredImg, 'blogs');
      return blogData;
    });

    res.json({
      success: true,
      blogs: blogsWithUrls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your blogs', error: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'firstName lastName profilePhoto bio');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await blog.incrementViews();

    const blogData = blog.getPublicData();
    if (blogData.featuredImg) blogData.featuredImg = getFileUrl(req, blogData.featuredImg, 'blogs');
    if (blogData.author && blogData.author.profilePhoto) {
      blogData.author.profilePhoto = getFileUrl(req, blogData.author.profilePhoto, 'profiles');
    }

    res.json({ success: true, blog: blogData });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog', error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) await deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, excerpt, content, category, status, isPublished } = req.body;
    let { tags } = req.body;
    
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = tags ? [tags] : [];
      }
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const isBlogPublished = status === 'published' || isPublished === 'true' || isPublished === true;

    let blogExcerpt = excerpt;
    if (!blogExcerpt || blogExcerpt.trim() === '') {
      const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      blogExcerpt = plainText.substring(0, 297).trim() + (plainText.length > 297 ? '...' : '');
    }
    
    const cleanContent = content.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

    const blogData = {
      title,
      excerpt: blogExcerpt,
      content: cleanContent,
      author: req.user._id,
      category: category || 'yoga',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      isPublished: isBlogPublished
    };

    if (req.file) blogData.featuredImg = req.file.filename;

    const blog = new Blog(blogData);
    await blog.save();
    await blog.populate('author', 'firstName lastName profilePhoto');

    const blogDataResponse = blog.getPublicData();
    if (blogDataResponse.featuredImg) blogDataResponse.featuredImg = getFileUrl(req, blogDataResponse.featuredImg, 'blogs');
    if (blogDataResponse.author && blogDataResponse.author.profilePhoto) {
      blogDataResponse.author.profilePhoto = getFileUrl(req, blogDataResponse.author.profilePhoto, 'profiles');
    }

    res.status(201).json({ success: true, message: 'Blog created successfully', blog: blogDataResponse });

  } catch (error) {
    if (req.file) await deleteFile(req.file.path);
    res.status(500).json({ success: false, message: 'Failed to create blog', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) await deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, excerpt, content, category, tags, isPublished } = req.body;
    const blog = req.blog;

    if (title) blog.title = title;
    if (excerpt) blog.excerpt = excerpt;
    if (content) {
      const cleanContent = content
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      blog.content = cleanContent;
    }
    if (category) blog.category = category;
    if (tags) blog.tags = Array.isArray(tags) ? tags : (tags ? [tags] : []);
    if (isPublished !== undefined) blog.isPublished = isPublished === 'true' || isPublished === true;

    if (req.file) {
      if (blog.featuredImg) {
        const oldImagePath = path.join(__dirname, '../uploads/blogs', blog.featuredImg);
        await deleteFile(oldImagePath);
      }
      blog.featuredImg = req.file.filename;
    }

    await blog.save();
    await blog.populate('author', 'firstName lastName profilePhoto');

    const blogData = blog.getPublicData();
    if (blogData.featuredImg) blogData.featuredImg = getFileUrl(req, blogData.featuredImg, 'blogs');
    if (blogData.author && blogData.author.profilePhoto) {
      blogData.author.profilePhoto = getFileUrl(req, blogData.author.profilePhoto, 'profiles');
    }

    res.json({ success: true, message: 'Blog updated successfully', blog: blogData });

  } catch (error) {
    if (req.file) await deleteFile(req.file.path);
    res.status(500).json({ success: false, message: 'Failed to update blog', error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log('Attempting to delete blog with ID:', blogId);
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log('Blog not found with ID:', blogId);
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    console.log('Found blog to delete:', blog.title);

    if (blog.featuredImg) {
      const imagePath = path.join(__dirname, '../uploads/blogs', blog.featuredImg);
      try {
        await deleteFile(imagePath);
        console.log('Blog image deleted:', blog.featuredImg);
      } catch (fileError) {
        console.log('Could not delete image file (may not exist):', fileError.message);
      }
    }

    await Blog.findByIdAndDelete(blog._id);
    console.log('Blog deleted successfully:', blog._id);

    res.json({ success: true, message: 'Blog deleted successfully' });

  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog', error: error.message });
  }
};

const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const userId = req.user._id;
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes = blog.likes.filter(like => like.toString() !== userId.toString());
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      success: true,
      message: isLiked ? 'Blog unliked' : 'Blog liked',
      isLiked: !isLiked,
      likesCount: blog.likes.length
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like/unlike blog', error: error.message });
  }
};

const getCategories = (req, res) => {
  const categories = ['yoga', 'meditation', 'fitness', 'nutrition', 'wellness', 'lifestyle'];
  res.json({ success: true, categories });
};

const getBlogForEdit = async (req, res) => {
  try {
    const blog = req.blog;
    await blog.populate('author', 'firstName lastName profilePhoto');

    const blogData = blog.getPublicData();
    if (blogData.featuredImg) blogData.featuredImg = getFileUrl(req, blogData.featuredImg, 'blogs');

    res.json({ success: true, blog: blogData });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog for editing', error: error.message });
  }
};

module.exports = {
  isLoggedIn,
  isAuthorOrAdmin,
  blogValidation,
  getAllBlogs,
  searchBlogs,
  getMyBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getCategories,
  getBlogForEdit
};