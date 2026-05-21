const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  featuredImg: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['yoga', 'meditation', 'fitness', 'nutrition', 'wellness', 'lifestyle'],
    default: 'yoga'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  readTime: {
    type: Number, // in minutes
    default: 1
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    
    // Add timestamp to make slug unique if needed
    const timestamp = Date.now().toString().slice(-4);
    this.slug = `${this.slug}-${timestamp}`;
  }
  
  if (this.isModified('content')) {
    // Calculate read time (average 200 words per minute)
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200) || 1;
  }
  
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Instance method to get public blog data
blogSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    title: this.title,
    slug: this.slug,
    excerpt: this.excerpt,
    content: this.content,
    featuredImg: this.featuredImg,
    author: this.author,
    category: this.category,
    tags: this.tags,
    isPublished: this.isPublished,
    publishedAt: this.publishedAt,
    views: this.views,
    likesCount: this.likes.length,
    readTime: this.readTime,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Instance method to increment views
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static method to find published blogs
blogSchema.statics.findPublished = function(options = {}) {
  const { category, tags, limit = 10, skip = 0, sort = { publishedAt: -1 } } = options;
  
  let query = { isPublished: true };
  
  if (category) {
    query.category = category;
  }
  
  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }
  
  return this.find(query)
    .populate('author', 'firstName lastName profilePhoto')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Static method to search blogs
blogSchema.statics.searchBlogs = function(searchTerm, options = {}) {
  const { limit = 10, skip = 0 } = options;
  
  const searchRegex = new RegExp(searchTerm, 'i');
  
  return this.find({
    isPublished: true,
    $or: [
      { title: searchRegex },
      { excerpt: searchRegex },
      { tags: searchRegex }
    ]
  })
  .populate('author', 'firstName lastName profilePhoto')
  .sort({ publishedAt: -1 })
  .limit(limit)
  .skip(skip);
};

// Index for better search performance
blogSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ category: 1 });

module.exports = mongoose.model('Blog', blogSchema); 