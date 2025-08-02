const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const aboutRoutes = require('./routes/aboutRoutes'); 
const  contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/auth');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog',blogRoutes);
app.use('/api/auth', authRoutes);

const { authenticateToken, requireAdmin } = require('./middleware/auth');

// Example: Protect blog admin routes
app.use('/api/blog/admin', authenticateToken, requireAdmin);
app.use('/api/about', authenticateToken, requireAdmin);
app.use('/api/contact', authenticateToken, requireAdmin);

const db=async()=>{
  try{
    await mongoose.connect('mongodb://localhost:27017/webtwist');
    console.log('mongoDb Connected');
  }
  catch(err){
    console.error(err);
  }

}


db();


app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});
