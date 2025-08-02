import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import './About.css';
import React, { useEffect, useState } from 'react';

const About = () => {
    const [content, setContent] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/about');
        const data = await res.json();
        setContent(data.content);
      } catch (err) {
        console.error('Failed to fetch about content:', err);
      }
    };

    fetchAbout();
  }, []);
  return (
    <div className="about-container">
      <Tilt glareEnable={true} glareMaxOpacity={0.2} scale={1.02} transitionSpeed={1500}>
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1>About WebTwist</h1>
          <p>
            {content}
          </p>
        </motion.div>
      </Tilt>
    </div>
  );
};

export default About;
