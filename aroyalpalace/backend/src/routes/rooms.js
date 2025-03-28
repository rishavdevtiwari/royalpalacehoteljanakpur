
const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await req.prisma.roomType.findMany({
      include: {
        rooms: true
      }
    });
    
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await req.prisma.roomType.findUnique({
      where: { id },
      include: {
        rooms: true,
        roomAmenities: {
          include: {
            amenity: true
          }
        }
      }
    });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Failed to fetch room', error: error.message });
  }
});

// Create room (admin only)
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      rateSingle, 
      rateDouble, 
      maxAdults, 
      maxChildren, 
      amenities, 
      imageUrl,
      rooms
    } = req.body;
    
    // Create room type
    const roomType = await req.prisma.roomType.create({
      data: {
        name,
        description,
        rateSingle,
        rateDouble,
        maxAdults,
        maxChildren,
        amenities,
        imageUrl
      }
    });
    
    // Create individual rooms if provided
    if (rooms && rooms.length > 0) {
      await req.prisma.room.createMany({
        data: rooms.map(room => ({
          roomNumber: room.roomNumber,
          floor: room.floor,
          roomTypeId: roomType.id,
          status: room.status || 'AVAILABLE'
        }))
      });
    }
    
    res.status(201).json({
      message: 'Room created successfully',
      roomType
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room', error: error.message });
  }
});

// Update room (admin only)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      rateSingle, 
      rateDouble, 
      maxAdults, 
      maxChildren, 
      amenities, 
      imageUrl 
    } = req.body;
    
    const updatedRoom = await req.prisma.roomType.update({
      where: { id },
      data: {
        name,
        description,
        rateSingle,
        rateDouble,
        maxAdults,
        maxChildren,
        amenities,
        imageUrl
      }
    });
    
    res.status(200).json({
      message: 'Room updated successfully',
      roomType: updatedRoom
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Failed to update room', error: error.message });
  }
});

// Delete room (admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete all rooms associated with this room type
    await req.prisma.room.deleteMany({
      where: { roomTypeId: id }
    });
    
    // Then delete the room type
    await req.prisma.roomType.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Failed to delete room', error: error.message });
  }
});

module.exports = router;
