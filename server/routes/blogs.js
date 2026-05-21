const express = require('express');
const router = express.Router();
const { uploadBlogImage, handleMulterError } = require('../config/multer');
const { isLoggedIn, isAdmin } = require('../controllers/authController');
const {
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
} = require('../controllers/blogController');

router.get('/', getAllBlogs);
router.get('/search', searchBlogs);
router.get('/my-blogs', isLoggedIn, getMyBlogs);
router.get('/meta/categories', getCategories);
router.get('/edit/:id', isLoggedIn, isAuthorOrAdmin, getBlogForEdit);
router.get('/:slug', getBlogBySlug);

router.post('/', isLoggedIn, isAdmin, uploadBlogImage, handleMulterError, createBlog);
router.put('/:id', isLoggedIn, isAdmin, uploadBlogImage, handleMulterError, updateBlog);
router.delete('/:id', isLoggedIn, isAdmin, deleteBlog);
router.post('/:id/like', isLoggedIn, likeBlog);

module.exports = router;