import { db } from '@/lib/db';
import { mockSyncUserEmails } from './gmail';

export async function runEmailSyncWorker() {
  console.log('[Email Sync] Starting background worker');
  
  try {
    // Get all users with Google tokens
    const users = await db.user.findMany({
      where: { 
        googleTokens: { not: null }
      },
      select: { id: true }
    });
    
    console.log(`[Email Sync] Found ${users.length} users with Google tokens`);
    
    for (const user of users) {
      try {
        console.log(`[Email Sync] Processing user ${user.id}`);
        await mockSyncUserEmails(user.id);
        console.log(`[Email Sync] Successfully processed user ${user.id}`);
      } catch (error) {
        console.error(`[Email Sync] Failed for user ${user.id}:`, error);
      }
    }
    
    console.log('[Email Sync] Worker completed');
    
    // Schedule next run (every 15 minutes)
    setTimeout(runEmailSyncWorker, 15 * 60 * 1000);
  } catch (error) {
    console.error('[Email Sync] Worker failed:', error);
    // Retry after 5 minutes on error
    setTimeout(runEmailSyncWorker, 5 * 60 * 1000);
  }
}

// Start worker on server init
if (process.env.NODE_ENV !== 'test') {
  runEmailSyncWorker().catch(console.error);
}