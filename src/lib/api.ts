/**
 * API utility for handling email submissions and other backend interactions
 */
import { Resend } from 'resend';
import config from './config';

// Initialize Resend with API key from configuration
const resend = new Resend(config.resendApiKey);

/**
 * Email content for the directory list delivery
 */
const DIRECTORY_EMAIL_SUBJECT = 'Your Exclusive List of Startup Directories';

/**
 * Generate the email HTML content for the directory list
 */
function generateDirectoryEmailContent(recipientEmail: string): string {
  return `
    Your Startup Directory Submission Guide

    Thank you for requesting our exclusive list of startup directories! Below you'll find a carefully curated list of platforms where you can submit your startup to increase visibility and drive traffic.

    High Authority Directories
    - ProductHunt - The go-to platform for new product launches
    - BetaList - Get early adopters for your startup
    - AngelList - Connect with investors and potential hires
    - Crunchbase - Establish your company profile on this trusted database
    - G2 - Get reviews and visibility for B2B products

    Niche-Specific Platforms
    - SaaSworthy - Specifically for SaaS products
    - AppSumo - Great for lifetime deals and promotions
    - IndieHackers - Community of independent founders
    - DesignerNews - Perfect for design-focused tools
    - AlternativeTo - Position your product as an alternative to established ones

    This is just a preview of the complete list. The full guide includes 50+ directories with submission tips for each platform.

    Access Full Directory Guide: https://yourdomain.com/full-directory-guide

    You're receiving this email because you requested our directory list. If you have any questions, feel free to reply to this email.
  `;
}

/**
 * Send the directory list email to the user
 * @param email The recipient's email address
 * @returns Promise with the send result
 */
async function sendDirectoryEmail(email: string): Promise<{ success: boolean, message: string }> {
  try {
    // In development mode, we'll handle the email sending in the frontend
    // In production, this would be handled by the serverless function
    if (config.isDevelopment) {
      console.log(`Would send directory email to: ${email}`);
      
      // In development, we'll simulate sending an email
      const { data, error } = await resend.emails.send({
        from: `${config.emailFromName} <${config.emailFromAddress}>`,
        to: email,
        subject: DIRECTORY_EMAIL_SUBJECT,
        html: generateDirectoryEmailContent(email),
      });

      if (error) {
        console.error('Error sending email with Resend:', error);
        return { success: false, message: 'Failed to send directory email' };
      }

      console.log('Email sent with Resend:', data);
      return { success: true, message: 'Directory email sent successfully' };
    }

    // In production, the serverless function will handle email sending
    return { success: true, message: 'Email will be sent by serverless function' };
  } catch (error) {
    console.error('Error in sendDirectoryEmail:', error);
    return { success: false, message: 'Failed to send directory email' };
  }
}

/**
 * Add email to Instantly campaign
 * @param email The email address to add
 * @param source Source of the email capture
 * @returns Promise with the result
 */
async function addToInstantlyCampaign(email: string, source: string): Promise<{ success: boolean, message: string }> {
  try {
    // In development mode, we'll handle the campaign addition in the frontend
    // In production, this would be handled by the serverless function
    if (config.isDevelopment) {
      console.log(`Would add email to Instantly campaign: ${email} (Source: ${source})`);
      return { success: true, message: 'Email would be added to Instantly in production' };
    }

    // In production, the serverless function will handle Instantly integration
    return { success: true, message: 'Email will be added to campaign by serverless function' };
  } catch (error) {
    console.error('Error in addToInstantlyCampaign:', error);
    return { success: false, message: 'Failed to add to email campaign' };
  }
}

/**
 * Submit an email to the backend for lead capture
 * @param email The email address to submit
 * @param source Optional source of the email capture (e.g., 'exit-intent', 'newsletter')
 * @returns Promise with the submission result
 */
export async function submitEmail(email: string, source: string = 'exit-intent'): Promise<{ success: boolean, message: string }> {
  try {
    // Log the submission
    console.log(`Email submitted: ${email} (Source: ${source})`);
    
    if (config.isDevelopment) {
      // In development, we handle each step individually for easier debugging
      
      // 1. Send directory email to the user
      const emailResult = await sendDirectoryEmail(email);
      if (!emailResult.success) {
        console.warn('Failed to send directory email, but continuing:', emailResult.message);
      }
      
      // 2. Add to Instantly campaign
      const campaignResult = await addToInstantlyCampaign(email, source);
      if (!campaignResult.success) {
        console.warn('Failed to add to Instantly campaign, but continuing:', campaignResult.message);
      }
      
      // Return a success response even if one of the operations failed
      // This ensures the user gets a good experience even if backend services have issues
      return {
        success: true,
        message: 'Email submitted successfully'
      };
    } else {
      // In production, try the main function first, then fall back to simplified function
      console.log('Calling serverless function...');
      
      try {
        // Try the main submit-email function first
        const response = await callServerlessFunction('submit-email', { email, source });
        return response;
      } catch (mainFunctionError) {
        console.error('Main function failed, trying simplified function as fallback:', mainFunctionError);
        
        try {
          // Try the simplified function as a fallback
          const response = await callServerlessFunction('submit-email-simple', { email, source });
          return response;
        } catch (simpleFunctionError) {
          console.error('Both functions failed:', simpleFunctionError);
          throw new Error('Could not process email submission. Please try again later.');
        }
      }
    }
  } catch (error) {
    console.error("Error submitting email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit email. Please try again later.'
    };
  }
}

/**
 * Call a serverless function with the given name and data
 */
async function callServerlessFunction(functionName: string, data: any): Promise<{ success: boolean, message: string }> {
  console.log(`Calling serverless function at: /.netlify/functions/${functionName}`);
  
  const response = await fetch(`/.netlify/functions/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  // For debugging, log the status and status text
  console.log(`Serverless function response: ${response.status} ${response.statusText}`);
  
  // Handle non-OK responses
  if (!response.ok) {
    let errorMessage = `Server error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // If parsing JSON fails, try to get text content
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (textError) {
        console.error('Could not parse error response:', textError);
      }
    }
    throw new Error(errorMessage);
  }
  
  // Parse JSON response
  let result;
  try {
    result = await response.json();
  } catch (jsonError) {
    console.error('Failed to parse JSON response:', jsonError);
    throw new Error('Invalid response from server');
  }
  
  // Check if the operation was successful based on the response
  if (!result.success) {
    throw new Error(result.message || 'Failed to submit email');
  }
  
  // Log detailed result for debugging
  console.log('Email submission result:', result);
  
  return {
    success: true,
    message: result.message || 'Email submitted successfully'
  };
}

// Function to create lead in Instantly through our backend
export const createInstantlyLead = async (email: string) => {
  try {
    const response = await fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        campaignId: import.meta.env.VITE_INSTANTLY_CAMPAIGN_ID
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create lead' }));
      throw new Error(errorData.message || 'Failed to create lead');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}; 