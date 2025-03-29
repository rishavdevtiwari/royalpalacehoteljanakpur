
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@royalhotelpalace' }
  });

  if (!adminExists) {
    const adminPassword = await bcrypt.hash('qwerty@123456', 10);
    await prisma.user.create({
      data: {
        email: 'admin@royalhotelpalace',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN'
      }
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  // Create room types
  const roomTypes = [
    {
      name: 'Executive Suite',
      description: 'Luxurious suite with separate living area and premium amenities',
      rateSingle: 299.99,
      rateDouble: 349.99,
      maxAdults: 2,
      maxChildren: 2,
      amenities: ['Free WiFi', 'Mini Bar', 'Room Service', 'Air Conditioning', 'Flat-screen TV', 'Safety Deposit Box'],
      imageUrl: '/images/executive-suite.jpg',
      totalRooms: 5
    },
    {
      name: 'Interconnecting Room',
      description: 'Perfect for families, these rooms can be connected for more space',
      rateSingle: 199.99,
      rateDouble: 249.99,
      maxAdults: 4,
      maxChildren: 2,
      amenities: ['Free WiFi', 'Mini Bar', 'Air Conditioning', 'Flat-screen TV', 'Safety Deposit Box'],
      imageUrl: '/images/interconnecting-room.jpg',
      totalRooms: 8
    },
    {
      name: 'Deluxe Room',
      description: 'Spacious room with modern amenities and comfortable furnishings',
      rateSingle: 149.99,
      rateDouble: 199.99,
      maxAdults: 2,
      maxChildren: 1,
      amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Tea/Coffee Maker'],
      imageUrl: '/images/deluxe-room.jpg',
      totalRooms: 15
    },
    {
      name: 'Superdeluxe Room',
      description: 'Premium room with extra amenities and elegant decor',
      rateSingle: 179.99,
      rateDouble: 229.99,
      maxAdults: 2,
      maxChildren: 1,
      amenities: ['Free WiFi', 'Mini Bar', 'Air Conditioning', 'Flat-screen TV', 'Safety Deposit Box', 'Premium Toiletries'],
      imageUrl: '/images/superdeluxe-room.jpg',
      totalRooms: 10
    },
    {
      name: 'Junior Suite',
      description: 'Elegant suite with separate living area and premium features',
      rateSingle: 249.99,
      rateDouble: 299.99,
      maxAdults: 2,
      maxChildren: 2,
      amenities: ['Free WiFi', 'Mini Bar', 'Room Service', 'Air Conditioning', 'Flat-screen TV', 'Safety Deposit Box', 'Bathtub'],
      imageUrl: '/images/junior-suite.jpg',
      totalRooms: 7
    }
  ];

  // Create amenities
  const amenities = [
    { name: 'Free WiFi', description: 'High-speed internet access', icon: 'wifi' },
    { name: 'Mini Bar', description: 'In-room refreshments', icon: 'wine' },
    { name: 'Room Service', description: '24/7 room service', icon: 'utensils' },
    { name: 'Air Conditioning', description: 'Climate control', icon: 'thermometer' },
    { name: 'Flat-screen TV', description: 'HD television', icon: 'tv' },
    { name: 'Safety Deposit Box', description: 'In-room safe', icon: 'lock' },
    { name: 'Tea/Coffee Maker', description: 'In-room beverage facilities', icon: 'coffee' },
    { name: 'Premium Toiletries', description: 'Luxury bathroom amenities', icon: 'spray-can' },
    { name: 'Bathtub', description: 'Separate bathtub', icon: 'bath' }
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity
    });
  }

  console.log('Amenities created');

  // Create room types and connect amenities
  for (const roomType of roomTypes) {
    const { amenities: amenityNames, ...roomTypeData } = roomType;
    
    const existingRoomType = await prisma.roomType.findFirst({
      where: { name: roomTypeData.name }
    });
    
    let roomTypeId;
    
    if (!existingRoomType) {
      const createdRoomType = await prisma.roomType.create({
        data: roomTypeData
      });
      roomTypeId = createdRoomType.id;
    } else {
      roomTypeId = existingRoomType.id;
    }
    
    // Connect amenities to room type
    for (const amenityName of amenityNames) {
      const amenity = await prisma.amenity.findUnique({
        where: { name: amenityName }
      });
      
      if (amenity) {
        await prisma.roomAmenity.upsert({
          where: {
            roomTypeId_amenityId: {
              roomTypeId: roomTypeId,
              amenityId: amenity.id
            }
          },
          update: {},
          create: {
            roomTypeId: roomTypeId,
            amenityId: amenity.id
          }
        });
      }
    }
  }

  console.log('Room types created');

  // Create rooms for each room type
  const roomTypes2 = await prisma.roomType.findMany();
  for (const roomType of roomTypes2) {
    const currentRooms = await prisma.room.count({
      where: { roomTypeId: roomType.id }
    });
    
    const roomsToCreate = roomType.totalRooms - currentRooms;
    
    if (roomsToCreate > 0) {
      for (let i = 1; i <= roomsToCreate; i++) {
        const floor = Math.floor(Math.random() * 5) + 1;
        const roomNumber = `${floor}${String(i).padStart(2, '0')}${roomType.name.charAt(0)}`;
        
        await prisma.room.create({
          data: {
            roomNumber,
            roomTypeId: roomType.id,
            floor,
            status: 'AVAILABLE'
          }
        });
      }
    }
  }

  console.log('Rooms created');
  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
