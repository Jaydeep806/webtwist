// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
  toggleFeatured
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.get('/admin/all', getAllBlogsAdmin);
router.post('/admin', createBlog);
router.put('/admin/:id', updateBlog);
router.delete('/admin/:id', deleteBlog);
router.patch('/admin/:id/publish', togglePublish);
router.patch('/admin/:id/featured', toggleFeatured);

module.exports = router;