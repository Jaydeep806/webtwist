require('dotenv').config(); // Load .env

const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');

const aboutRoutes = require('./routes/aboutRoutes'); 
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/auth');

const { authenticateToken, requireAdmin } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);

// Admin-Protected Routes
app.use('/api/about/admin', authenticateToken, requireAdmin);
app.use('/api/contact/admin', authenticateToken, requireAdmin);
app.use('/api/blog/admin', authenticateToken, requireAdmin);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
};

connectDB();

app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});

