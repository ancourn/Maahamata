import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// For demo purposes, we'll use a mock user ID
const DEMO_USER_ID = "demo-user-123";

export async function GET() {
  try {
    const emails = await db.email.findMany({
      where: {
        userId: DEMO_USER_ID
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      count: emails.length,
      emails 
    });
  } catch (error) {
    console.error('Failed to fetch emails:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}