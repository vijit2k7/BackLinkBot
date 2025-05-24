import { Resend } from 'resend';

// Initialize Resend with API key (in production, use environment variables)
const RESEND_API_KEY = process.env.RESEND_API_KEY || 'YOUR_RESEND_API_KEY';
const resend = new Resend(RESEND_API_KEY);

interface EmailContent {
  toEmail: string;
  directoryName: string;
}

/**
 * Sends a confirmation email to the user who submitted a directory
 */
export async function sendConfirmationEmail({ toEmail, directoryName }: EmailContent): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Backlink Bot <directories@backlinkbot.ai>',
      to: [toEmail],
      subject: 'Directory Submission Received - Backlink Bot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://backlinkbot.ai/logo.png" alt="Backlink Bot Logo" style="max-width: 150px;">
          </div>
          
          <h1 style="color: #6B46C1; font-size: 24px; margin-bottom: 20px;">Directory Submission Received</h1>
          
          <p>Thank you for submitting your directory <strong>${directoryName}</strong> to Backlink Bot.</p>
          
          <p>Our team will review your submission and get back to you shortly. Here's what happens next:</p>
          
          <ul style="margin-bottom: 20px;">
            <li>Our team reviews your directory for quality standards and relevance</li>
            <li>If approved, we'll add it to our directory submission list</li>
            <li>We'll notify you when the directory has been added</li>
          </ul>
          
          <p>If you have any questions or need to provide additional information, please reply to this email or contact us at <a href="mailto:amplifyxlabsteam@gmail.com">amplifyxlabsteam@gmail.com</a>.</p>
          
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px;">The Backlink Bot Team</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #6B7280;">
            <p>© ${new Date().getFullYear()} Backlink Bot. All rights reserved.</p>
            <p>
              <a href="https://backlinkbot.ai/privacy" style="color: #6B46C1; text-decoration: none; margin-right: 10px;">Privacy Policy</a>
              <a href="https://backlinkbot.ai/terms" style="color: #6B46C1; text-decoration: none;">Terms of Service</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }

    console.log('Confirmation email sent:', data);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
} 