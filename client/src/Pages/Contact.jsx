import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css'; // 👈 Add this line

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', captchaInput: '' });
  const [status, setStatus] = useState('');
  const [captchaExpected] = useState(generateCaptcha());

  function generateCaptcha() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', { ...form, captchaExpected });
      setStatus('✅ Message sent!');
      setForm({ name: '', email: '', message: '', captchaInput: '' });
    } catch (err) {
      setStatus('❌ Failed: ' + err.response?.data?.message);
    }
  };

  return (
    <div className="contact-wrapper">
      <form onSubmit={handleSubmit} className="contact-form">
        <h2>Contact Us</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          required
        />

        <div className="captcha-row">
          <span>CAPTCHA: <strong>{captchaExpected}</strong></span>
          <input
            name="captchaInput"
            value={form.captchaInput}
            onChange={handleChange}
            placeholder="Enter CAPTCHA"
            required
          />
        </div>

        <button type="submit">Send</button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
};

export default Contact;
