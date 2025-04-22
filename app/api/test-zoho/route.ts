import { NextRequest, NextResponse } from 'next/server';
import { createZohoLead, getZohoAccessToken } from '@/lib/zoho-integration';

export async function GET() {
  try {
    // Test getting an access token
    const token = await getZohoAccessToken();
    
    // Create a test lead
    const testLead = {
      First_Name: "Test",
      Last_Name: "User",
      Email: "test@example.com",
      Phone: "+971123456789",
      Description: "This is a test lead to verify Zoho CRM integration",
      Lead_Source: "API Test",
      Company: "Test Company"
    };

    const result = await createZohoLead(testLead);
    
    return NextResponse.json({ 
      success: true, 
      message: "Zoho integration test successful",
      token: "****" + token.substring(token.length - 4), // Only show the last 4 chars of token
      result 
    });
  } catch (error) {
    console.error("Zoho test failed:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: "Zoho integration test failed",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}