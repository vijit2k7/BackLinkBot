import { Handler } from '@netlify/functions';
import axios from 'axios';

const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { email, campaignId } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email is required' })
      };
    }

    if (!campaignId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Campaign ID is required' })
      };
    }

    // Make request to Instantly API
    const response = await axios.post(
      'https://api.instantly.ai/api/v2/leads',
      {
        email,
        campaign: campaignId,
        personalization: 'Thanks for subscribing to our directory list!',
        lt_interest_status: 1,
        pl_value_lead: 'High',
        skip_if_in_workspace: true,
        skip_if_in_campaign: true,
        verify_leads_on_import: true
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.VITE_INSTANTLY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        message: error.response?.data?.message || 'Internal server error'
      })
    };
  }
};

export { handler }; 