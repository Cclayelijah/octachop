import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedUserTypes() {
  try {
    // Create user types if they don't exist
    await prisma.userType.upsert({
      where: { userTypeName: 'user' },
      update: {},
      create: {
        userTypeName: 'user',
        userTypeDesc: 'Regular user with basic access'
      }
    })

    await prisma.userType.upsert({
      where: { userTypeName: 'admin' },
      update: {},
      create: {
        userTypeName: 'admin',
        userTypeDesc: 'Administrator with access to admin panel'
      }
    })

    await prisma.userType.upsert({
      where: { userTypeName: 'superadmin' },
      update: {},
      create: {
        userTypeName: 'superadmin',
        userTypeDesc: 'Super administrator with full system access'
      }
    })

    console.log('User types seeded successfully!')
  } catch (error) {
    console.error('Error seeding user types:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedUserTypes()