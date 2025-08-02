import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const AdminLogin = () => {
  const { user, logout } = useAuth();
  
  // Existing states
  const [contacts, setContacts] = useState([]);
  const [content, setContent] = useState('');
  
  // Blog management states
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    excerpt: '',
    image: '',
    tags: '',
    published: true,
    featured: false
  });

  // Fetch About content
  useEffect(() => {
    fetch('http://localhost:5000/api/about')
      .then(res => res.json())
      .then(data => setContent(data.content))
      .catch(err => console.error('Error fetching about content:', err));
  }, []);

  // Fetch Contact Messages
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch Blogs when blog tab is active
  useEffect(() => {
    if (activeTab === 'blogs') {
      fetchBlogs();
    }
  }, [activeTab]);

  const fetchContacts = () => {
    axios.get("http://localhost:5000/api/contact")
      .then(res => {
        const updatedContacts = res.data.map(item => ({
          ...item,
          editedMessage: item.message
        }));
        setContacts(updatedContacts);
      })
      .catch(err => {
        console.error("Error fetching contacts:", err);
      });
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blog/admin/all');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Save About content
  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (res.ok) {
        alert('About content updated successfully');
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      alert('Error occurred');
      console.error(err);
    }
  };

  // Update contact message
  const handleEdit = async (id, message) => {
    try {
      await axios.put(`http://localhost:5000/api/contact/${id}`, { message });
      alert("Message updated successfully");
      fetchContacts();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update message");
    }
  };

  // Delete contact message
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contact/${id}`);
        alert("Message deleted successfully");
        fetchContacts();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete message");
      }
    }
  };

  // Blog management functions
  const resetBlogForm = () => {
    setBlogFormData({
      title: '',
      content: '',
      author: 'Admin',
      excerpt: '',
      image: '',
      tags: '',
      published: true,
      featured: false
    });
    setEditingBlog(null);
    setShowBlogForm(false);
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...blogFormData,
        tags: blogFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingBlog) {
        await axios.put(`http://localhost:5000/api/blog/admin/${editingBlog._id}`, blogData);
        alert('Blog updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/blog/admin', blogData);
        alert('Blog created successfully!');
      }
      
      resetBlogForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBlogEdit = (blog) => {
    setBlogFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      excerpt: blog.excerpt,
      image: blog.image || '',
      tags: blog.tags.join(', '),
      published: blog.published,
      featured: blog.featured
    });
    setEditingBlog(blog);
    setShowBlogForm(true);
  };

  const handleBlogDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blog/admin/${id}`);
        alert('Blog deleted successfully!');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog');
      }
    }
  };

  const togglePublish = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/blog/admin/${id}/publish`);
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/blog/admin/${id}/featured`);
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleBlogInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, {user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'about' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('about')}
        >
          About Page
        </button>
        <button 
          className={activeTab === 'contacts' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('contacts')}
        >
          Contact Messages
        </button>
        <button 
          className={activeTab === 'blogs' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Management
        </button>
      </div>

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="tab-content">
          <h2>Edit About Page</h2>
          <textarea
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit About content..."
            className="admin-textarea"
          />
          <button onClick={handleSave} className="btn-primary">Save</button>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="tab-content">
          <h2>Contact Messages</h2>
          {contacts.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            contacts.map((c) => (
              <div key={c._id} className="contact-card">
                <p><strong>Name:</strong> {c.name}</p>
                <p><strong>Email:</strong> {c.email}</p>
                <p><strong>Date:</strong> {new Date(c.createdAt).toLocaleDateString()}</p>
                <textarea
                  value={c.editedMessage}
                  onChange={(e) =>
                    setContacts(prev =>
                      prev.map(item =>
                        item._id === c._id
                          ? { ...item, editedMessage: e.target.value }
                          : item
                      )
                    )
                  }
                  className="contact-textarea"
                />
                <div className="button-group">
                  <button 
                    className="update-btn"
                    onClick={() => handleEdit(c._id, c.editedMessage)}
                  >
                    Update
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
        <div className="tab-content">
          <div className="blog-header">
            <h2>Blog Management</h2>
            <button 
              onClick={() => setShowBlogForm(!showBlogForm)} 
              className="btn-primary"
            >
              {showBlogForm ? 'Cancel' : 'Add New Post'}
            </button>
          </div>

          {/* Blog Form */}
          {showBlogForm && (
            <div className="blog-form-container">
              <h3>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
              <form onSubmit={handleBlogSubmit} className="blog-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={blogFormData.title}
                      onChange={handleBlogInputChange}
                      required
                      placeholder="Enter blog title"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Author</label>
                    <input
                      type="text"
                      name="author"
                      value={blogFormData.author}
                      onChange={handleBlogInputChange}
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Excerpt *</label>
                  <textarea
                    name="excerpt"
                    value={blogFormData.excerpt}
                    onChange={handleBlogInputChange}
                    required
                    placeholder="Brief description of the blog post"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    name="content"
                    value={blogFormData.content}
                    onChange={handleBlogInputChange}
                    required
                    placeholder="Write your blog content here..."
                    rows="10"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Featured Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={blogFormData.image}
                      onChange={handleBlogInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={blogFormData.tags}
                      onChange={handleBlogInputChange}
                      placeholder="tech, programming, tutorial"
                    />
                  </div>
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="published"
                      checked={blogFormData.published}
                      onChange={handleBlogInputChange}
                    />
                    Published
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={blogFormData.featured}
                      onChange={handleBlogInputChange}
                    />
                    Featured
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingBlog ? 'Update Blog' : 'Create Blog'}
                  </button>
                  <button type="button" onClick={resetBlogForm} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Blog List */}
          <div className="blogs-list">
            {blogs.length === 0 ? (
              <p>No blog posts yet.</p>
            ) : (
              blogs.map((blog) => (
                <div key={blog._id} className="blog-card">
                  <div className="blog-card-header">
                    <h3>{blog.title}</h3>
                    <div className="blog-status">
                      <span className={`status ${blog.published ? 'published' : 'draft'}`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                      {blog.featured && <span className="status featured">Featured</span>}
                    </div>
                  </div>
                  
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  
                  <div className="blog-meta">
                    <span>By {blog.author}</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{blog.views} views</span>
                  </div>

                  {blog.tags.length > 0 && (
                    <div className="blog-tags">
                      {blog.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="blog-actions">
                    <button 
                      onClick={() => handleBlogEdit(blog)} 
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => togglePublish(blog._id)} 
                      className={`btn-toggle ${blog.published ? 'unpublish' : 'publish'}`}
                    >
                      {blog.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button 
                      onClick={() => toggleFeatured(blog._id)} 
                      className={`btn-toggle ${blog.featured ? 'unfeature' : 'feature'}`}
                    >
                      {blog.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button 
                      onClick={() => handleBlogDelete(blog._id)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;