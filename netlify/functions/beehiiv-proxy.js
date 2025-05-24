const axios = require('axios');

exports.handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No content needed for preflight response
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400', // 24 hours cache for preflight
      },
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:8080',
        },
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Make request to Beehiiv API
    const response = await axios.post(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIVE_LIST_ID}/subscriptions`,
      {
        email,
        reactivate_existing: false,
        send_welcome_email: true
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.BEEHIVE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Beehiiv API Error:', error.response?.data || error.message);
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
      },
      body: JSON.stringify({
        error: error.response?.data?.message || 'Failed to add subscriber to Beehiiv'
      })
    };
  }
}; 