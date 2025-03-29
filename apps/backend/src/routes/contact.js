
const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const emailService = require('../services/email');

// Submit contact form (no authentication required)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    console.log('Received contact form submission:', { name, email, subject });
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' });
    }
    
    // Create contact message
    const contactMessage = await req.prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message
      }
    });
    
    console.log('Contact message saved to database:', contactMessage.id);
    
    // Send email notification
    try {
      console.log('Attempting to send email notification about contact form');
      await emailService.sendContactFormEmail({
        name,
        email,
        phone,
        subject,
        message
      });
      console.log('Contact form email notification sent successfully');
    } catch (emailError) {
      console.error('Failed to send contact form email notification:', emailError);
      // Continue processing even if email fails
    }
    
    res.status(201).json({
      message: 'Message sent successfully',
      contactId: contactMessage.id
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Failed to submit contact form', error: error.message });
  }
});

// Get all contact messages (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const contactMessages = await req.prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(contactMessages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Failed to fetch contact messages', error: error.message });
  }
});

module.exports = router;
