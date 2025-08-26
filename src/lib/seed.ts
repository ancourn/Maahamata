import { db } from './db';

async function main() {
  console.log('Seeding database...');

  // Create sample users
  const user1 = await db.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  });

  const user2 = await db.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
  });

  const user3 = await db.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Johnson',
    },
  });

  console.log('Created users:', { user1, user2, user3 });

  // Create sample posts
  const post1 = await db.post.create({
    data: {
      title: 'Getting Started with Next.js 15',
      content: 'Next.js 15 brings exciting new features like improved App Router, better performance, and enhanced developer experience.',
      authorId: user1.id,
      published: true,
    },
  });

  const post2 = await db.post.create({
    data: {
      title: 'Understanding Prisma ORM',
      content: 'Prisma is a next-generation ORM that makes database access easy with a type-safe database client.',
      authorId: user2.id,
      published: true,
    },
  });

  const post3 = await db.post.create({
    data: {
      title: 'Building with shadcn/ui',
      content: 'shadcn/ui provides beautiful, accessible components that you can copy and paste into your apps.',
      authorId: user3.id,
      published: false,
    },
  });

  console.log('Created posts:', { post1, post2, post3 });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });