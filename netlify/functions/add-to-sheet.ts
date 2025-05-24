import { Handler } from '@netlify/functions';
import { google } from 'googleapis';

// Configure Google Sheets with the provided credentials
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Directory Submissions';

// Update headers array to include all fields
const HEADERS = [
  'Email',
  'Directory Name',
  'Directory URL',
  'Domain Rating',
  'Category',
  'Submission Type',
  'Submission URL',
  'Fee',
  'Turnaround Time',
  'Additional Info',
  'Submission Date',
  'Status',
  'Environment'
];

// CORS headers for development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Function to ensure sheet exists
async function ensureSheetExists() {
  try {
    // First, get the spreadsheet metadata
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    // Check if our sheet already exists
    const sheetExists = spreadsheet.data.sheets?.some(
      sheet => sheet.properties?.title === SHEET_NAME
    );

    if (!sheetExists) {
      // Create the sheet with headers
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEET_NAME,
              }
            }
          }]
        }
      });

      // Add headers to the new sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:M1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [HEADERS]
        }
      });
    }
  } catch (error) {
    console.error('Error ensuring sheet exists:', error);
    throw error;
  }
}

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
    // Ensure the sheet exists before proceeding
    await ensureSheetExists();

    // Parse the request body
    const {
      email,
      directoryName,
      directoryUrl,
      domainRating,
      category,
      submissionType,
      submissionUrl,
      fee,
      turnaroundTime,
      additionalInfo,
      submissionDate,
      status = 'Pending Review'
    } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Email is required' }),
      };
    }

    // Prepare the row data with all fields
    const row = [
      email,
      directoryName || '',
      directoryUrl || '',
      domainRating || '',
      category || '',
      submissionType || '',
      submissionUrl || '',
      fee || 'Not specified',
      turnaroundTime || 'Not specified',
      additionalInfo || 'None',
      submissionDate || new Date().toISOString(),
      status,
      process.env.NODE_ENV || 'development'
    ];

    // Append the row to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:M`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log(`Successfully added directory submission for ${email} to Google Sheet`);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        message: 'Directory submission added to spreadsheet successfully' 
      }),
    };
  } catch (error) {
    console.error('Error adding to spreadsheet:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        message: 'Failed to add directory submission to spreadsheet',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler }; 