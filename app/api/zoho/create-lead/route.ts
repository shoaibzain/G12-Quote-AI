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
    const result = await createZohoLead(leadData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Lead created successfully",
      result 
    });
  } catch (error) {
    console.error("Error creating Zoho lead:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: "Failed to create lead in Zoho CRM",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}