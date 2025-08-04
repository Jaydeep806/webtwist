// src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
  }, [currentPage, searchTerm, selectedTag]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://webtwist.onrender.com/api/blog`, {
        params: {
          page: currentPage,
          limit: 6,
          search: searchTerm,
          tag: selectedTag
        }
      });
      
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      
      // Extract unique tags
      const tags = response.data.blogs.reduce((acc, blog) => {
        blog.tags.forEach(tag => {
          if (!acc.includes(tag)) acc.push(tag);
        });
        return acc;
      }, []);
      setAllTags(tags);
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await axios.get(`https://webtwist.onrender.com/api/blog/featured`);
      setFeaturedBlogs(response.data);
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setCurrentPage(1);
  };

  if (loading && currentPage === 1) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <div className="blog-container">
      {/* Hero Section */}
      <div className="blog-hero">
        <h1>Our Blog</h1>
        <p>Discover insights, tutorials, and stories from our team</p>
      </div>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <section className="featured-section">
          <h2>Featured Posts</h2>
          <div className="featured-grid">
            {featuredBlogs.map(blog => (
              <Link key={blog._id} to={`/blog/${blog.slug}`} className="featured-card">
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="featured-image" />
                )}
                <div className="featured-content">
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <div className="blog-meta">
                    <span>By {blog.author}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <div className="blog-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="filter-section">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="tag-filter"
          >
            <option value="">All Categories</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          
          {(searchTerm || selectedTag) && (
            <button onClick={clearFilters} className="clear-filters">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="blogs-grid">
        {blogs.map(blog => (
          <article key={blog._id} className="blog-card">
            {blog.image && (
              <div className="blog-image-container">
              <Link to={`/blog/${blog.slug}`} className="image-link">
               <img src={blog.image} alt={blog.title} className="blog-image-element" />
              </Link>
        </div>
)}
            
            <div className="blog-content">
              <div className="blog-tags">
                {blog.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              
              <h2>
                <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
              </h2>
              
              <p className="blog-excerpt">{blog.excerpt}</p>
              
              <div className="blog-meta">
                <span>By {blog.author}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>{blog.views} views</span>
              </div>
              
              <Link to={`/blog/${blog.slug}`} className="read-more">
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {blogs.length === 0 && !loading && (
        <div className="no-blogs">
          <h3>No blogs found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
