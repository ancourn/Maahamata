import { EmailTriageAgent } from '@/src/ai-core/agents/EmailTriageAgent';
import { getUnprocessedEmails, updateEmailAnalysis } from './gmail';
import { prisma } from '@/lib/db';

export class EmailTriageService {
  private triageAgent = new EmailTriageAgent();

  async processUnprocessedEmails(userId: string) {
    try {
      // Get unprocessed emails
      const unprocessedEmails = await getUnprocessedEmails(userId);
      
      if (unprocessedEmails.length === 0) {
        return { processed: 0, message: 'No new emails to process' };
      }

      const results = [];
      
      // Process each email
      for (const email of unprocessedEmails) {
        try {
          const analysis = await this.triageAgent.handle('', {
            from: email.from,
            subject: email.subject,
            emailBody: email.body,
            userId
          });

          // Update email with AI analysis
          await updateEmailAnalysis(email.id, analysis);
          
          results.push({
            emailId: email.id,
            analysis,
            success: true
          });

          console.log(`Processed email ${email.id}: ${analysis.category} (urgency: ${analysis.urgency})`);

        } catch (error) {
          console.error(`Failed to process email ${email.id}:`, error);
          
          // Mark as processed even if failed, with default analysis
          await updateEmailAnalysis(email.id, {
            category: 'FOLLOW_UP',
            urgency: 5,
            suggestedAction: 'Review manually'
          });
          
          results.push({
            emailId: email.id,
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
          });
        }
      }

      return {
        processed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      };

    } catch (error) {
      console.error('Email triage service error:', error);
      throw error;
    }
  }

  async triageSingleEmail(emailId: string) {
    try {
      const email = await prisma.email.findUnique({
        where: { id: emailId }
      });

      if (!email) {
        throw new Error('Email not found');
      }

      const analysis = await this.triageAgent.handle('', {
        from: email.from,
        subject: email.subject,
        emailBody: email.body,
        userId: email.userId
      });

      await updateEmailAnalysis(emailId, analysis);

      return {
        success: true,
        emailId,
        analysis
      };

    } catch (error) {
      console.error(`Failed to triage email ${emailId}:`, error);
      throw error;
    }
  }

  async startAutoTriageInterval(userId: string, intervalMinutes: number = 5) {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    const processInterval = setInterval(async () => {
      try {
        const result = await this.processUnprocessedEmails(userId);
        console.log(`Auto-triage completed: ${result.processed} emails processed`);
        
        // Emit results via socket if available
        if (global.socketServer) {
          global.socketServer.emit('email_triage_complete', {
            userId,
            result,
            timestamp: new Date().toISOString()
          });
        }
        
      } catch (error) {
        console.error('Auto-triage interval error:', error);
      }
    }, intervalMs);

    // Store interval ID for cleanup
    if (!global.emailTriageIntervals) {
      global.emailTriageIntervals = new Map<string, NodeJS.Timeout>();
    }
    
    global.emailTriageIntervals.set(userId, processInterval);
    
    console.log(`Started auto-triage for user ${userId} every ${intervalMinutes} minutes`);
    
    return processInterval;
  }

  stopAutoTriageInterval(userId: string) {
    if (global.emailTriageIntervals?.has(userId)) {
      const interval = global.emailTriageIntervals.get(userId);
      clearInterval(interval);
      global.emailTriageIntervals.delete(userId);
      console.log(`Stopped auto-triage for user ${userId}`);
    }
  }
}

// Export singleton instance
export const emailTriageService = new EmailTriageService();