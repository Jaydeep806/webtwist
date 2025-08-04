// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogDetail.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      fetchRelatedBlogs();
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://webtwist.onrender.com/api/blog/${slug}`);
      setBlog(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching blog:', error);
      if (error.response?.status === 404) {
        setError('Blog post not found');
      } else {
        setError('Error loading blog post');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      // Get blogs with similar tags
      const tag = blog.tags[0];
      if (tag) {
        const response = await axios.get(`https://webtwist.onrender.com/api/blog`, {
          params: { tag, limit: 3 }
        });
        // Filter out current blog
        const related = response.data.blogs.filter(b => b._id !== blog._id);
        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading blog post...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <Link to="/blogs" className="back-link">← Back to Blog</Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="error-container">
        <h2>Blog post not found</h2>
        <Link to="/blogs" className="back-link">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <article className="blog-detail">
        {/* Back Navigation */}
        <div className="blog-nav">
          <Link to="/blogs" className="back-link">← Back to Blog</Link>
        </div>

        {/* Blog Header */}
        <header className="blog-header">
          <div className="blog-tags">
            {blog.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          
          <h1>{blog.title}</h1>
          
          <div className="blog-meta">
            <span>By {blog.author}</span>
            <span>•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>•</span>
            <span>{blog.views} views</span>
          </div>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="blog-image-container">
            <img src={blog.image} alt={blog.title} className="blog-featured-image" />
          </div>
        )}

        {/* Blog Content */}
        <div className="blog-content">
          <div className="blog-excerpt">
            <em>{blog.excerpt}</em>
          </div>
          
          <div 
            className="blog-text"
            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }}
          />
        </div>

        {/* Blog Footer */}
        <footer className="blog-footer">
          <div className="share-section">
            <h4>Share this post:</h4>
            <div className="share-buttons">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="share-btn"
              >
                Copy Link
              </button>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn twitter"
              >
                Twitter
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn facebook"
              >
                Facebook
              </a>
            </div>
          </div>
        </footer>
      </article>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="related-posts">
          <h3>Related Posts</h3>
          <div className="related-grid">
            {relatedBlogs.map(relatedBlog => (
              <Link 
                key={relatedBlog._id} 
                to={`/blog/${relatedBlog.slug}`} 
                className="related-card"
              >
                {relatedBlog.image && (
                  <img src={relatedBlog.image} alt={relatedBlog.title} />
                )}
                <div className="related-content">
                  <h4>{relatedBlog.title}</h4>
                  <p>{relatedBlog.excerpt}</p>
                  <span className="related-date">
                    {new Date(relatedBlog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
