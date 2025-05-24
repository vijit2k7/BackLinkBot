// Health check function to verify environment variables and function setup

// Common headers for all responses
const headers = {
  "Access-Control-Allow-Origin": "*", // Restrict this to your domain in production
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};

// Handler for OPTIONS requests (CORS preflight)
function handleOptions() {
  return {
    statusCode: 204, // No content
    headers,
    body: ""
  };
}

exports.handler = async (event, context) => {
  console.log('Health check function started at:', new Date().toISOString());
  
  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  // Check for environment variables
  const envVars = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set (length: ' + process.env.RESEND_API_KEY.length + ')' : 'Not set',
    INSTANTLY_API_KEY: process.env.INSTANTLY_API_KEY ? 'Set (length: ' + process.env.INSTANTLY_API_KEY.length + ')' : 'Not set',
    INSTANTLY_CAMPAIGN_ID: process.env.INSTANTLY_CAMPAIGN_ID || 'Not set',
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Not set',
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'Not set',
  };

  // Check for required packages
  let packageStatus = 'OK';
  try {
    require('resend');
    // No longer using node-fetch, using native fetch in Node.js 18+
  } catch (error) {
    packageStatus = `Error loading packages: ${error.message}`;
  }

  // Check NodeJS version
  const nodeVersion = process.version;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Environment check completed',
      environment: envVars,
      packageStatus,
      nodeVersion,
      timestamp: new Date().toISOString()
    })
  };
}; 