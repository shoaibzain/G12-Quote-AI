import { NextRequest, NextResponse } from 'next/server';
import { createZohoLead } from '@/lib/zoho-integration';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const leadData = await request.json();
    
    // Validate the required fields
    if (!leadData.Last_Name || !leadData.Email) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields (Last_Name and Email are required)"
      }, { status: 400 });
    }
    
    // Create the lead in Zoho CRM
    try {
      const result = await createZohoLead(leadData);
      
      return NextResponse.json({ 
        success: true, 
        message: "Lead created successfully",
        result 
      });
    } catch (zohoError) {
      console.error("Zoho API specific error:", zohoError);
      // Return more detailed error for debugging
      return NextResponse.json({ 
        success: false, 
        message: "Failed to create lead in Zoho CRM",
        error: zohoError instanceof Error ? zohoError.message : String(zohoError),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        // Don't include sensitive data like API keys
        leadData: { 
          hasEmail: !!leadData.Email,
          hasLastName: !!leadData.Last_Name
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating Zoho lead:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: "Failed to create lead in Zoho CRM",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}