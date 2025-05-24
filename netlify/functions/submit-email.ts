import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const handler: Handler = async (event) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const { email, source } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Email is required' }),
      };
    }

    // Prepare email content based on source
    let subject = 'Your Startup Directory List';
    let content = `
      <h1>Thank you for subscribing!</h1>
      <p>Here's your list of 50+ startup directories where you can submit your startup.</p>
      <p>We've carefully curated these directories based on:</p>
      <ul>
        <li>Domain authority</li>
        <li>Submission process quality</li>
        <li>Startup relevance</li>
        <li>Traffic potential</li>
      </ul>
      <p>You'll receive the complete list in a follow-up email shortly from Piyushh, check your promotions tab & spam folder if you don't see it.</p>
      <p>Best regards,<br>Alex from Backlink Bot</p>
    `;

    if (source === 'directory-submission') {
      subject = 'Thank you for submitting your directory';
      content = `
        <h1>Thank you for your submission!</h1>
        <p>We've received your directory submission and our team will review it shortly.</p>
        <p>We evaluate directories based on:</p>
        <ul>
          <li>Domain authority (DR)</li>
          <li>Content quality</li>
          <li>User experience</li>
          <li>Submission process</li>
        </ul>
        <p>We'll notify you once we've completed our review.</p>
        <p>Best regards,<br>The Backlink Bot Team</p>
      `;
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: process.env.VITE_EMAIL_FROM_ADDRESS || 'piyushh@backlinkbotai.com',
      to: email,
      subject: subject,
      html: content,
    });

    console.log('Email sent successfully:', data);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler }; 