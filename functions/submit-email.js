// Serverless function for email submissions
// This would be deployed as a Netlify or Vercel serverless function

const { Resend } = require('resend');
// Remove node-fetch dependency and use native fetch in Node.js 18+

// Initialize email service
const resend = new Resend(process.env.RESEND_API_KEY);

// Common headers for all responses
const headers = {
  "Access-Control-Allow-Origin": "*", // Restrict this to your domain in production
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// Email template for directory list
function generateDirectoryEmailHTML(email) {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          h1 { color: #2563eb; }
          h2 { color: #4338ca; margin-top: 25px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 8px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; }
          .button { display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Your Startup Directory Submission Guide</h1>
        <p>Thank you for requesting our exclusive list of startup directories! Below you'll find a carefully curated list of platforms where you can submit your startup to increase visibility and drive traffic.</p>
        
        <h2>High Authority Directories</h2>
        <ul>
          <li><strong>ProductHunt</strong> - The go-to platform for new product launches</li>
          <li><strong>BetaList</strong> - Get early adopters for your startup</li>
          <li><strong>AngelList</strong> - Connect with investors and potential hires</li>
          <li><strong>Crunchbase</strong> - Establish your company profile on this trusted database</li>
          <li><strong>G2</strong> - Get reviews and visibility for B2B products</li>
        </ul>
        
        <h2>Niche-Specific Platforms</h2>
        <ul>
          <li><strong>SaaSworthy</strong> - Specifically for SaaS products</li>
          <li><strong>AppSumo</strong> - Great for lifetime deals and promotions</li>
          <li><strong>IndieHackers</strong> - Community of independent founders</li>
          <li><strong>DesignerNews</strong> - Perfect for design-focused tools</li>
          <li><strong>AlternativeTo</strong> - Position your product as an alternative to established ones</li>
        </ul>
        
        <p>This is just a preview of the complete list. The full guide includes 50+ directories with submission tips for each platform.</p>
        
        <a href="https://yourdomain.com/full-directory-guide" class="button">Access Full Directory Guide</a>
        
        <div class="footer">
          <p>You're receiving this email because you requested our directory list. If you have any questions, feel free to reply to this email.</p>
          <p>Your email: ${email}</p>
        </div>
      </body>
    </html>
  `;
}

// Add to Instantly campaign
async function addToInstantlyCampaign(email, source) {
  try {
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
      return false;
    }

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
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Instantly API error (${response.status}): ${errorText}`);
      return false;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('Error adding to Instantly campaign:', data);
      return false;
    }
    
    console.log('Successfully added to Instantly campaign:', data);
    return true;
  } catch (error) {
    console.error('Error adding to Instantly campaign:', error.message);
    return false;
  }
}

// Handler for OPTIONS requests (CORS preflight)
function handleOptions() {
  return {
    statusCode: 204, // No content
    headers,
    body: ""
  };
}

// Main function handler
exports.handler = async (event, context) => {
  console.log('Function started at:', new Date().toISOString());
  
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

  // Log the environment for debugging
  console.log('Function environment:', {
    nodeEnv: process.env.NODE_ENV || 'not set',
    resendApiKey: process.env.RESEND_API_KEY ? 'Set (length: ' + process.env.RESEND_API_KEY.length + ')' : 'Not set',
    emailFromName: process.env.EMAIL_FROM_NAME || 'Not set',
    emailFromAddress: process.env.EMAIL_FROM_ADDRESS || 'Not set'
  });

  try {
    // Parse request body
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (e) {
      console.error('Failed to parse request body:', e.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Invalid request body format' })
      };
    }

    const { email, source = 'exit-intent' } = parsedBody;
    
    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Invalid email address' })
      };
    }

    // Email configuration
    const fromEmail = process.env.EMAIL_FROM_ADDRESS || 'directories@yourdomain.com';
    const fromName = process.env.EMAIL_FROM_NAME || 'Startup Directories';
    const fromField = `${fromName} <${fromEmail}>`;
    
    console.log(`Attempting to send email from: ${fromField} to: ${email}`);
    
    // Send email using Resend
    let emailResult = { success: false, error: null };
    try {
      const { data, error } = await resend.emails.send({
        from: fromField,
        to: email,
        subject: 'Your Exclusive List of Startup Directories',
        html: generateDirectoryEmailHTML(email),
      });
      
      if (error) {
        console.error('Error sending email with Resend:', error);
        emailResult.error = error;
      } else {
        console.log('Email sent successfully with Resend:', data);
        emailResult.success = true;
      }
    } catch (emailError) {
      console.error('Exception when sending email with Resend:', emailError);
      emailResult.error = emailError.message;
    }
    
    // Add to Instantly campaign
    let campaignResult = false;
    try {
      campaignResult = await addToInstantlyCampaign(email, source);
    } catch (campaignError) {
      console.error('Exception when adding to Instantly campaign:', campaignError);
    }
    
    // Log the submission
    console.log(`Email submitted: ${email} (Source: ${source})`);
    
    // Return success response even if some operations failed
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email submitted successfully',
        emailSent: emailResult.success,
        emailError: emailResult.error ? emailResult.error.toString() : null,
        addedToCampaign: campaignResult
      })
    };
  } catch (error) {
    console.error('Error in submit-email function:', error);
    
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