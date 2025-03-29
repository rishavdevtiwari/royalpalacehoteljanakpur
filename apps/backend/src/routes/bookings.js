
const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const emailService = require('../services/email');

// Get all bookings (admin) or user's bookings (regular user)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { id, role } = req.user;
    
    // Define query based on user role
    const query = role === 'ADMIN'
      ? {} // Admin can see all bookings
      : { userId: id }; // Regular users can only see their bookings
    
    const bookings = await req.prisma.booking.findMany({
      where: query,
      include: {
        room: {
          include: {
            roomType: true
          }
        },
        payments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

// Get booking by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await req.prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            roomType: true
          }
        },
        payments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is admin or booking owner
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
});

// Create booking
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { 
      roomId, 
      checkInDate, 
      checkOutDate, 
      adults, 
      children, 
      occupancyType, 
      extraBed, 
      totalAmount,
      specialRequests 
    } = req.body;
    
    console.log('Creating booking with data:', {
      userId: req.user.id,
      roomId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      occupancyType,
      extraBed,
      totalAmount
    });
    
    // Generate a unique booking reference
    const bookingReference = `BK${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    
    // Create booking
    const booking = await req.prisma.booking.create({
      data: {
        userId: req.user.id,
        roomId,
        bookingReference,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        adults,
        children: children || 0,
        occupancyType: occupancyType || 'SINGLE',
        extraBed: extraBed || false,
        totalAmount,
        specialRequests,
        status: 'CONFIRMED'
      },
      include: {
        room: {
          include: {
            roomType: true
          }
        },
        user: true
      }
    });
    
    console.log('Booking created successfully:', booking.id);
    
    // Update room status to occupied
    await req.prisma.room.update({
      where: { id: roomId },
      data: { status: 'OCCUPIED' }
    });
    
    // Send confirmation email
    try {
      console.log('Attempting to send booking confirmation email');
      await emailService.sendBookingConfirmationEmail(booking, booking.user);
      console.log('Booking confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Continue processing even if email fails
    }
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

// Update booking status (admin only or cancel by owner)
router.patch('/:id/status', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Get the booking
    const booking = await req.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only admin can change any status, users can only cancel their own bookings
    if (req.user.role !== 'ADMIN') {
      if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      if (status !== 'CANCELLED') {
        return res.status(403).json({ message: 'Users can only cancel their bookings' });
      }
    }
    
    // Update booking status
    const updatedBooking = await req.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        room: {
          include: {
            roomType: true
          }
        },
        user: true
      }
    });
    
    // If booking is cancelled or completed, update room status to available
    if (status === 'CANCELLED' || status === 'COMPLETED') {
      await req.prisma.room.update({
        where: { id: booking.roomId },
        data: { status: 'AVAILABLE' }
      });
    }
    
    // Send notification email about status change
    if (status === 'CANCELLED') {
      // In a real app, you would send a cancellation email here
      console.log(`Booking #${booking.bookingReference} has been cancelled`);
    } else if (status === 'COMPLETED') {
      // In a real app, you would send a completion email here
      console.log(`Booking #${booking.bookingReference} has been completed`);
    }
    
    res.status(200).json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status', error: error.message });
  }
});

// Add a payment to a booking (for demo purposes)
router.post('/:id/payments', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod } = req.body;
    
    // Check if booking exists and belongs to user
    const booking = await req.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only admin or booking owner can add payments
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Create payment record
    const payment = await req.prisma.payment.create({
      data: {
        bookingId: id,
        amount,
        paymentMethod,
        paymentStatus: 'COMPLETED',
        transactionId: `TXN${Date.now()}`,
        paymentDate: new Date()
      }
    });
    
    // Send payment receipt
    try {
      console.log('Attempting to send payment receipt email');
      await emailService.sendPaymentReceiptEmail(payment, booking, booking.user);
      console.log('Payment receipt email sent successfully');
    } catch (emailError) {
      console.error('Failed to send payment receipt email:', emailError);
      // Continue processing even if email fails
    }
    
    res.status(201).json({
      message: 'Payment added successfully',
      payment
    });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ message: 'Failed to add payment', error: error.message });
  }
});

module.exports = router;
