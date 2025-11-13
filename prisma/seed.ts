import { Category, RequestStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import prisma from '../src/utils/db';
import { hashPassword } from '../src/utils/auth';

const DEFAULT_PASSWORD = 'Password@123#';

// Helper function to generate random number in range
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random element from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const main = async () => {
  console.log('🌱 Seeding database...');

  // Delete all existing data
  await prisma.comment.deleteMany();
  await prisma.productRequest.deleteMany();
  await prisma.user.deleteMany();

  // Create 2 users
  const users = await createUsers();
  console.log(`✅ Created ${users.length} users`);

  // Create 7 product requests with random comments and replies
  await createProductRequestsWithComments(users);
  console.log('✅ Created 7 product requests with comments and replies');

  console.log('🎉 Database seeded successfully!');
};

async function createUsers() {
  const users = [];

  for (let i = 0; i < 2; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        username: faker.internet
          .userName({ firstName, lastName })
          .toLowerCase(),
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        image: faker.image.avatar(),
        password: await hashPassword(DEFAULT_PASSWORD),
      },
    });
    users.push(user);
  }

  return users;
}

async function createProductRequestsWithComments(users: any[]) {
  const categories = Object.values(Category);
  const statuses = Object.values(RequestStatus);

  for (let i = 1; i <= 7; i++) {
    const randomCreator = getRandomElement(users);
    const productRequest = await prisma.productRequest.create({
      data: {
        id: faker.string.uuid(),
        title: faker.hacker.phrase(),
        description: faker.lorem.paragraph({ min: 1, max: 3 }),
        createdBy: randomCreator.id,
      },
    });
    // Generate random number of comments (5-20)
    const numComments = randomBetween(5, 20);

    const createdComments = [];
    for (let j = 0; j < numComments; j++) {
      const randomUser = getRandomElement(users);

      const comment = await prisma.comment.create({
        data: {
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph({ min: 1, max: 4 }),
          category: getRandomElement(categories),
          status: getRandomElement(statuses),
          upvotes: faker.number.int({ min: 1, max: 500 }),
          userId: randomUser.id,
          productRequestId: productRequest.id,
        },
      });

      createdComments.push(comment);

      // Generate random number of replies (0-5) for this comment
      const numReplies = randomBetween(0, 5);

      for (let k = 0; k < numReplies; k++) {
        const replyUser = getRandomElement(users);

        await prisma.comment.create({
          data: {
            id: faker.string.uuid(),
            content: faker.lorem.paragraph({ min: 1, max: 2 }),
            userId: replyUser.id,
            productRequestId: productRequest.id,
            parentId: comment.id,
            replyingTo: randomUser.username,
          },
        });
      }
    }
  }
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Seed failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
