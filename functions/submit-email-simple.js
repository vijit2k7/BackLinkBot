// Simplified email submission function without dependencies
// For testing if the function deployment works at all

// Common headers for all responses
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// Handler for OPTIONS requests (CORS preflight)
function handleOptions() {
  return {
    statusCode: 204,
    headers,
    body: ""
  };
}

exports.handler = async (event, context) => {
  console.log('Function started at:', new Date().toISOString());
  console.log('Event httpMethod:', event.httpMethod);
  
  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    // Parse request body (but don't actually do anything with it)
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
      console.log('Received email:', parsedBody.email);
    } catch (e) {
      console.error('Failed to parse request body:', e.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Invalid request body format' })
      };
    }

    // Just log the request and return success
    console.log('Simplified function executed successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email logged successfully (simplified function)',
        note: 'This is a simplified function that does not actually send emails',
        email: parsedBody.email,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error in simplified function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'An error occurred while processing your request',
        error: error.message
      })
    };
  }
}; 