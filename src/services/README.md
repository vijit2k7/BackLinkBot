# Directory Submission Integration

This document describes how to set up the Google Sheets and Resend email integration for the directory submission form.

## Prerequisites

1. Google Cloud account with Google Sheets API enabled
2. Resend.com account for email sending
3. Access to environment variables on your hosting platform

## Google Sheets Setup

1. Create a new Google Sheet to store directory submissions
2. Set up a Service Account in Google Cloud:
   - Go to Google Cloud Console: https://console.cloud.google.com/
   - Create a new project (or select an existing one)
   - Enable the Google Sheets API
   - Go to "Credentials" and create a Service Account
   - Generate a JSON key for the Service Account
   - Share your Google Sheet with the Service Account email

3. Note the following information:
   - Google Sheet ID (from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`)
   - Service Account Client Email
   - Service Account Private Key

## Resend Setup

1. Sign up for an account at [Resend.com](https://resend.com)
2. Create an API key
3. Add and verify your sending domain
4. Test your email configuration

## Environment Variables

Add the following environment variables to your hosting platform:

```
# Google Sheets
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key

# Resend
RESEND_API_KEY=your_resend_api_key
```

For local development, you can create a `.env` file in the root of your project:

```
VITE_GOOGLE_SHEET_ID=your_sheet_id
VITE_GOOGLE_CLIENT_EMAIL=your_service_account_email
VITE_GOOGLE_PRIVATE_KEY=your_private_key
VITE_RESEND_API_KEY=your_resend_api_key
```

## API Integration

For the form to work with a backend, you need to set up API endpoints:

### Vercel

1. Create a file at `pages/api/submit-directory.ts` with the server-side code.
2. Update the `apiUrl` in `directorySubmissionClient.ts` to point to your API.

### Netlify

1. Create a serverless function at `netlify/functions/submit-directory.js`
2. Update the `apiUrl` in `directorySubmissionClient.ts` to point to your function.

## Testing

After setup, test the form submission process:

1. Fill out the directory submission form
2. Check that the data appears in your Google Sheet
3. Verify that a confirmation email is sent to the provided email address 