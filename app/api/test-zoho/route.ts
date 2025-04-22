import { NextRequest, NextResponse } from 'next/server';
import { getZohoAccessToken } from '@/lib/zoho-integration';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Zoho authentication...');
    
    // Capture environment info (non-sensitive)
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasClientId: !!process.env.ZOHO_CLIENT_ID,
      hasClientSecret: !!process.env.ZOHO_CLIENT_SECRET,
      hasRefreshToken: !!process.env.ZOHO_REFRESH_TOKEN,
      vercelEnv: process.env.VERCEL_ENV || 'Not Vercel'
    };
    
    // Try to get a Zoho access token
    let token = null;
    let errorMessage = null;
    
    try {
      token = await getZohoAccessToken();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Failed to get Zoho token:", errorMessage);
    }
    
    return NextResponse.json({ 
      success: !!token, 
      message: token ? "Successfully retrieved Zoho access token" : "Failed to retrieve Zoho access token",
      tokenReceived: !!token,
      environment: envInfo,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error testing Zoho authentication:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: "Failed to retrieve Zoho access token",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}