const Contact = require('../models/contactModel');

exports.createContact = async (req, res) => {
  const { name, email, message, captchaInput, captchaExpected } = req.body;

  if (captchaInput !== captchaExpected) {
    return res.status(400).json({ message: "CAPTCHA does not match." });
  }

  try {
    const contact = await Contact.create({ name, email, message });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateContact = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};