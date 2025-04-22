/**
 * Zoho API Integration Module
 * 
 * This module handles authentication and API calls to Zoho CRM.
 */

// Configuration for Zoho API
const ZOHO_CONFIG = {
  clientId: '1000.TWCXX40GPZBCTE7XDT0ZMUSN2E23WV',
  clientSecret: '245bc4acc64eb98918dac5e2a1da85c314c537e2a9',
  refreshToken: '1000.16fbe2cb1d4dfb1a8bfdb644e46913c6.f5252bc07c365182bd17e544cd6270',
  accountsUrl: 'https://accounts.zoho.com',
  // Using the more specific API URL for the Middle East region (Dubai is in UAE)
  apiBaseUrl: 'https://www.zohoapis.com',
  // Backup domains if needed
  alternativeApiDomains: [
    'https://www.zohoapis.eu',  // Europe
    'https://www.zohoapis.in',  // India
    'https://www.zohoapis.com.cn',  // China
    'https://www.zohoapis.com.au'  // Australia
  ]
};

// Interface for the access token response
interface AccessTokenResponse {
  access_token: string;
  api_domain: string;
  token_type: string;
  expires_in: number;
}

let accessToken: string | null = null;
let tokenExpiry: number = 0;
// Store the valid API domain once we've determined it
let validApiDomain: string = ZOHO_CONFIG.apiBaseUrl;

/**
 * Get a valid access token for Zoho API
 * Refreshes the token if expired
 */
export async function getZohoAccessToken(): Promise<string> {
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Check if we have a valid token
  if (accessToken && tokenExpiry > currentTime + 60) {
    return accessToken;
  }
  
  try {
    console.log('Requesting new Zoho access token...');
    
    // Request new access token
    const response = await fetch(`${ZOHO_CONFIG.accountsUrl}/oauth/v2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: ZOHO_CONFIG.clientId,
        client_secret: ZOHO_CONFIG.clientSecret,
        refresh_token: ZOHO_CONFIG.refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to refresh token: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to refresh Zoho access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as AccessTokenResponse;
    console.log('Received Zoho token data:', { ...data, access_token: '***REDACTED***' });
    
    // Update token and expiry time
    accessToken = data.access_token;
    tokenExpiry = currentTime + data.expires_in;
    
    // If the API provides a specific domain, use it
    if (data.api_domain) {
      validApiDomain = `https://${data.api_domain}`;
      console.log('Using API domain from response:', validApiDomain);
    }
    
    return accessToken;
  } catch (error) {
    console.error('Error refreshing Zoho access token:', error);
    throw error;
  }
}

/**
 * Try to find a working API domain for Zoho CRM
 */
async function findWorkingApiDomain(): Promise<string> {
  // First try the current domain
  try {
    const token = await getZohoAccessToken();
    const response = await fetch(`${validApiDomain}/crm/v2/settings/modules`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    if (response.ok) {
      console.log('Confirmed working API domain:', validApiDomain);
      return validApiDomain;
    }
  } catch (error) {
    console.log('Current API domain not working, trying alternatives...');
  }
  
  // Try alternative domains
  for (const domain of ZOHO_CONFIG.alternativeApiDomains) {
    try {
      const token = await getZohoAccessToken();
      const response = await fetch(`${domain}/crm/v2/settings/modules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        validApiDomain = domain;
        console.log('Found working API domain:', validApiDomain);
        return domain;
      }
    } catch (error) {
      console.log(`API domain ${domain} not working`);
    }
  }
  
  throw new Error('Could not find a working Zoho API domain');
}

/**
 * Create a lead in Zoho CRM
 */
export async function createZohoLead(leadData: {
  First_Name?: string;
  Last_Name: string;
  Email: string;
  Phone?: string;
  Company?: string;
  Description?: string;
  [key: string]: any;
}) {
  try {
    console.log('Creating Zoho lead with data:', { ...leadData, Email: '***REDACTED***' });
    const token = await getZohoAccessToken();
    
    // Try to ensure we're using a working domain
    const apiDomain = validApiDomain;
    
    console.log(`Sending lead data to ${apiDomain}/crm/v2/Leads`);
    const response = await fetch(`${apiDomain}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [leadData],
      }),
    });

    const responseBody = await response.text();
    console.log('Zoho API response status:', response.status);
    console.log('Zoho API response body:', responseBody);

    if (!response.ok) {
      // If we get a 401, our token might be invalid or we're using the wrong domain
      if (response.status === 401) {
        console.log('Authentication failed. Trying to find working domain...');
        const newDomain = await findWorkingApiDomain();
        
        // Try once more with the new domain
        if (newDomain !== apiDomain) {
          return createZohoLead(leadData); // Recursive call with hopefully correct domain
        }
      }
      
      throw new Error(`Failed to create lead: ${response.status} ${response.statusText} - ${responseBody}`);
    }

    const jsonResponse = JSON.parse(responseBody);
    console.log('Lead created successfully:', jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error('Error creating Zoho lead:', error);
    throw error;
  }
}

/**
 * Create a deal/opportunity in Zoho CRM
 */
export async function createZohoDeal(dealData: {
  Deal_Name: string;
  Amount?: number;
  Stage?: string;
  Closing_Date?: string;
  [key: string]: any;
}) {
  try {
    const token = await getZohoAccessToken();
    
    const response = await fetch(`${validApiDomain}/crm/v2/Deals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [dealData],
      }),
    });

    const responseBody = await response.text();
    if (!response.ok) {
      throw new Error(`Failed to create deal: ${response.status} ${response.statusText} - ${responseBody}`);
    }

    return JSON.parse(responseBody);
  } catch (error) {
    console.error('Error creating Zoho deal:', error);
    throw error;
  }
}

/**
 * Search for existing leads or contacts in Zoho CRM
 */
export async function searchZohoRecords(module: string, criteria: string) {
  try {
    const token = await getZohoAccessToken();
    
    const response = await fetch(
      `${validApiDomain}/crm/v2/${module}/search?criteria=${encodeURIComponent(criteria)}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const responseBody = await response.text();
    if (!response.ok) {
      throw new Error(`Failed to search records: ${response.status} ${response.statusText} - ${responseBody}`);
    }

    return JSON.parse(responseBody);
  } catch (error) {
    console.error(`Error searching Zoho ${module}:`, error);
    throw error;
  }
}