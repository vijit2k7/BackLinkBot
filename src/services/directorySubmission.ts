import { appendToGoogleSheet, DirectorySubmission } from './googleSheets';
import { sendConfirmationEmail } from './email';

/**
 * Handles the entire directory submission process:
 * 1. Saves the submission to Google Sheets
 * 2. Sends a confirmation email
 */
export async function submitDirectory(formData: Omit<DirectorySubmission, 'submittedAt'>): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Add submitted timestamp
    const submission: DirectorySubmission = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    // Save to Google Sheets
    const sheetSuccess = await appendToGoogleSheet(submission);
    
    if (!sheetSuccess) {
      console.error('Failed to save submission to Google Sheet');
      // Continue with email even if Google Sheets fails
    }

    // Send confirmation email
    const emailSuccess = await sendConfirmationEmail({
      toEmail: submission.contactEmail,
      directoryName: submission.directoryName
    });

    if (!emailSuccess) {
      console.error('Failed to send confirmation email');
      // Return partial success if only the email failed
      if (sheetSuccess) {
        return {
          success: true,
          message: 'Your submission was recorded, but we could not send a confirmation email. Please check your email address.'
        };
      }
    }

    // If both operations succeeded or at least one succeeded
    if (sheetSuccess || emailSuccess) {
      return {
        success: true,
        message: 'Directory submission successful. Thank you!'
      };
    }

    // If both operations failed
    return {
      success: false,
      message: 'Failed to process your submission. Please try again later.'
    };
  } catch (error) {
    console.error('Directory submission error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    };
  }
} 