// controllers/blogController.js
const Blog = require('../models/blogModel');

// Get all blogs (public - only published)
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 6, search, tag } = req.query;
    
    let query = { published: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    const blogs = await Blog.find(query)
      .select('-content') // Exclude content for listing
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      published: true 
    });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get featured blogs
exports.getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      published: true, 
      featured: true 
    })
    .select('-content')
    .sort({ createdAt: -1 })
    .limit(3);
    
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN ROUTES
// Get all blogs for admin (including unpublished)
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, excerpt, image, tags, published, featured } = req.body;
    
    // Generate slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters except spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    // Add timestamp if slug is empty
    if (!slug) {
      slug = 'blog-' + Date.now();
    }
    
    // Check if slug already exists and make it unique
    let originalSlug = slug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
    
    const blog = new Blog({
      title,
      content,
      author: author || 'Admin',
      excerpt,
      image,
      tags: tags || [],
      published: published !== undefined ? published : true,
      featured: featured || false,
      slug
    });
    
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, author, excerpt, image, tags, published, featured } = req.body;
    
    let updateData = {
      title,
      content,
      author,
      excerpt,
      image,
      tags,
      published,
      featured
    };
    
    // If title is being updated, generate new slug
    if (title) {
      let slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters except spaces
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
      // Add timestamp if slug is empty
      if (!slug) {
        slug = 'blog-' + Date.now();
      }
      
      // Check if slug already exists (excluding current blog)
      let originalSlug = slug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: req.params.id } })) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      
      updateData.slug = slug;
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (err) {
    console.error('Update blog error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle publish status
exports.togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    blog.published = !blog.published;
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    blog.featured = !blog.featured;
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};