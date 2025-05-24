// Test function for Instantly API integration

// Common headers for all responses
const headers = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

exports.handler = async (event, context) => {
  console.log('Instantly test function started at:', new Date().toISOString());
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { email = "test@example.com", source = "instant-test" } = JSON.parse(event.body || '{}');
    
    // Log the API call parameters for debugging
    console.log('Instantly API call parameters:', {
      apiKey: process.env.INSTANTLY_API_KEY ? 'Set (length: ' + process.env.INSTANTLY_API_KEY.length + ')' : 'Not set',
      campaignId: process.env.INSTANTLY_CAMPAIGN_ID || 'Not set',
      email: email,
      source: source
    });

    // Check if API key and campaign ID are available
    if (!process.env.INSTANTLY_API_KEY || !process.env.INSTANTLY_CAMPAIGN_ID) {
      console.error('Missing Instantly API key or campaign ID');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Missing required environment variables',
          details: {
            INSTANTLY_API_KEY: process.env.INSTANTLY_API_KEY ? 'Set' : 'Not set',
            INSTANTLY_CAMPAIGN_ID: process.env.INSTANTLY_CAMPAIGN_ID || 'Not set'
          }
        })
      };
    }

    // Detailed logging of the API request
    console.log('Making request to Instantly API with:');
    console.log('- URL:', 'https://api.instantly.ai/api/v1/lead/add');
    console.log('- Campaign ID:', process.env.INSTANTLY_CAMPAIGN_ID);
    console.log('- Email:', email);
    console.log('- Source:', source);

    // Use native fetch available in Node.js 18+
    const response = await fetch('https://api.instantly.ai/api/v1/lead/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INSTANTLY_API_KEY}`
      },
      body: JSON.stringify({
        campaignId: process.env.INSTANTLY_CAMPAIGN_ID,
        email,
        source,
      })
    });
    
    // Log full response status
    console.log('Instantly API response status:', response.status, response.statusText);
    
    // Parse response based on content type
    const contentType = response.headers.get('content-type') || '';
    let data;
    let responseText;
    
    if (contentType.includes('application/json')) {
      data = await response.json();
      responseText = JSON.stringify(data);
    } else {
      responseText = await response.text();
      try {
        // Try to parse as JSON anyway in case content-type is wrong
        data = JSON.parse(responseText);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }
    }
    
    // Handle non-OK responses
    if (!response.ok) {
      console.error(`Instantly API error (${response.status}):`, responseText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Error from Instantly API',
          apiStatus: response.status,
          apiResponse: responseText
        })
      };
    }
    
    if (!data || !data.success) {
      console.error('Error adding to Instantly campaign:', data || responseText);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Error response from Instantly API',
          apiResponse: data || responseText
        })
      };
    }
    
    console.log('Successfully added to Instantly campaign:', data);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully added to Instantly campaign',
        apiResponse: data
      })
    };
  } catch (error) {
    console.error('Error in Instantly test function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error in Instantly test function',
        error: error.message
      })
    };
  }
}; 