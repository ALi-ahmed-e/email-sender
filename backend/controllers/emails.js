const Email = require("../models/EmailModel");



const createEmail = async (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
 
    try {
      await Email.create({ name, email });
      res.status(201).json({ message: 'Email created!' });
    } catch (error) {
      console.error('Failed to create email:', error);
      res.status(500).json({ error: 'Failed to create email.' });
    }
}

const deleteEmail = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
 
    try {
      await Email.deleteOne({ email });
      res.status(200).json({ message: 'Email deleted!' });
    } catch (error) {
      console.error('Failed to delete email:', error);
      res.status(500).json({ error: 'Failed to delete email.' });
    }
}

const getEmails = async (req, res) => {
    const { query } = req.query; 
    try {
      const emails = await Email.find(query ? { email: { $regex: query, $options: 'i' } } : {});
      res.status(200).json(emails);
    } catch (error) {
      console.error('Failed to get emails:', error);
      res.status(500).json({ error: 'Failed to get emails.' });
    }
}

module.exports = { createEmail, deleteEmail,getEmails}