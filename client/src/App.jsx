import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import Collaborations from './Pages/Collaborations';
import Testimonials from './Pages/Testimonials';
import Outreach from './Pages/Outreach';
import Blogs from './Pages/Blog';
import Offers from './Pages/Offers';
import Pricing from './Pages/Pricing';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import AdminDashboard from './Pages/AdminLogin';
import ProtectedRoute from './Component/ProtectedRoute';
import Navbar from './Component/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/collaborations" element={<Collaborations />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/outreach" element={<Outreach />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;