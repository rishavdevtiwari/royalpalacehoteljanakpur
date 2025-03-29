
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const roomsRoutes = require('./routes/rooms');
const bookingsRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');

// Create Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Log key environment variables (without sensitive data)
console.log('Environment configuration:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('- HOTEL_EMAIL:', process.env.HOTEL_EMAIL);
console.log('- EMAIL_PASSWORD:', process.EMAIL_PASSWORD ? '[SET]' : '[NOT SET]');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '[SET]' : '[NOT SET]');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '[SET]' : '[NOT SET]');

// Make Prisma available to routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/contact', contactRoutes);

// Enhanced health check route
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    let dbStatus = 'unknown';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (dbError) {
      dbStatus = `error: ${dbError.message}`;
    }
    
    // Check email configuration
    const emailConfigured = !!process.env.EMAIL_PASSWORD;
    
    res.status(200).json({ 
      status: 'ok', 
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      database: dbStatus,
      email: emailConfigured ? 'configured' : 'missing password',
      frontend: process.env.FRONTEND_URL
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Royal Palace Hotel API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
