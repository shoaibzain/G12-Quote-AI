import { NextRequest, NextResponse } from 'next/server';
import { getZohoAccessToken } from '@/lib/zoho-integration';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Zoho authentication...');
    
    // Try to get a Zoho access token
    const token = await getZohoAccessToken();
    
    return NextResponse.json({ 
      success: true, 
      message: "Successfully retrieved Zoho access token",
      tokenReceived: !!token
    });
  } catch (error) {
    console.error("Error testing Zoho authentication:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: "Failed to retrieve Zoho access token",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}