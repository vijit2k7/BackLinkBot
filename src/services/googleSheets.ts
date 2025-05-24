import { google } from 'googleapis';

// This would normally be loaded from environment variables or a secure config
// For production, move these credentials to environment variables
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || 'YOUR_GOOGLE_SHEET_ID';
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || 'YOUR_CLIENT_EMAIL';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || 'YOUR_PRIVATE_KEY';

export interface DirectorySubmission {
  directoryName: string;
  directoryUrl: string;
  domainRating: string;
  category: string;
  submissionType: string;
  submissionUrl: string;
  fee: string;
  turnaroundTime: string;
  contactEmail: string;
  additionalInfo: string;
  submittedAt: string;
}

/**
 * Appends directory submission data to a Google Sheet
 */
export async function appendToGoogleSheet(submission: DirectorySubmission): Promise<boolean> {
  try {
    // Configure auth client
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Create sheets client
    const sheets = google.sheets({ version: 'v4', auth });

    // Format the data for the sheet
    const values = [
      [
        submission.directoryName,
        submission.directoryUrl,
        submission.domainRating,
        submission.category,
        submission.submissionType,
        submission.submissionUrl,
        submission.fee,
        submission.turnaroundTime,
        submission.contactEmail,
        submission.additionalInfo,
        submission.submittedAt
      ]
    ];

    // Append the data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Sheet1!A:K', // Adjust range as needed
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('Data appended to Google Sheet:', response.data);
    return true;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    return false;
  }
} 