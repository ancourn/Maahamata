import { db } from './db';

async function main() {
  console.log('Creating demo user for email system...');

  // Create demo user
  const demoUser = await db.user.create({
    data: {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User',
      googleTokens: {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expiry_date: Date.now() + 3600000
      }
    },
  });

  console.log('Created demo user:', demoUser);

  console.log('Demo user created successfully!');
}

main()
  .catch((e) => {
    console.error('Error creating demo user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });