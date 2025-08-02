
const express = require('express');
const About = require('../models/aboutModel'); 

const router = express.Router();

router.get('/', async (req, res) => {
  const about = await About.findOne();
  if (!about) return res.status(404).json({ content: '' });
  res.json(about);
});

router.put('/', async (req, res) => {
  const { content } = req.body;
  let about = await About.findOne();
  if (!about) {
    about = new About({ content });
  } else {
    about.content = content;
  }

  await about.save();
  res.status(200).json({ message: 'Updated successfully' });
});

module.exports = router;
