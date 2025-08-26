import { NextResponse } from "next/server";
import { mockSyncUserEmails } from "@/lib/gmail";

// For demo purposes, we'll use a mock user ID
// In a real app, this would come from authentication
const DEMO_USER_ID = "demo-user-123";

export async function POST() {
  try {
    // For demonstration, we'll use the mock sync function
    // In a real app, you would use: syncUserEmails(session.user.id);
    const emails = await mockSyncUserEmails(DEMO_USER_ID);
    
    return NextResponse.json({ 
      success: true, 
      count: emails.length,
      emails 
    });
  } catch (error) {
    console.error('Email sync failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}