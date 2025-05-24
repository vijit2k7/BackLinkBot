# Exit Intent Email Capture with Resend & Instantly Integration

This feature adds an exit intent popup that appears when users are about to leave your site, prompting them to enter their email in exchange for a list of startup directories.

## Features

- **Exit Intent Detection**: Detects when users are about to leave your site
- **Email Capture Form**: Clean, responsive form to collect emails
- **Success Animation**: Visual feedback for successful submissions
- **Resend Integration**: Automatically sends the directory list via email
- **Instantly Integration**: Adds captured emails to your Instantly campaign
- **Serverless Function**: Handles email processing on the server side

## Setup Instructions

### 1. API Keys

You'll need to set up the following API keys in your environment variables:

```
RESEND_API_KEY=your_resend_api_key
INSTANTLY_API_KEY=your_instantly_api_key
INSTANTLY_CAMPAIGN_ID=your_campaign_id
```

For local development, create a `.env` file based on the `.env.example` template.

### 2. Email Configuration

Set the following email configuration in your environment variables:

```
EMAIL_FROM_NAME=Startup Directories
EMAIL_FROM_ADDRESS=your-verified-email@yourdomain.com
```

Note: For Resend, you need to verify the sending domain.

### 3. Serverless Function Deployment

The `/functions/submit-email.js` function will be automatically deployed if you're using Netlify or Vercel. Make sure to set up the environment variables in your hosting platform's dashboard.

### 4. Testing the Implementation

To test the exit intent popup:
1. Move your mouse cursor outside the top of the browser window
2. The popup should appear asking for an email
3. Submit a test email and check your inbox
4. Verify that the email is added to your Instantly campaign

## Customization

### Email Template

You can modify the email template in both:
- `src/lib/api.ts` (for development testing)
- `functions/submit-email.js` (for production)

### Popup Content

Customize the popup content in `src/components/ExitIntentPopup.tsx`:
- Change the headline and description
- Update the benefits list
- Modify the success message

### Popup Behavior

The popup behavior can be adjusted in the same file:
- Change when the popup appears
- Adjust the popup frequency (currently once per session)
- Modify the delay before closing after submission

## Analytics

Email submissions are tracked in:
1. Console logs
2. Google Analytics (if configured)

You can extend tracking by adding your own analytics code in the `handleEmailSubmit` function in `App.tsx`.

## Troubleshooting

- **Popup doesn't appear**: Make sure you're not in development mode with React strict mode enabled, which can trigger useEffect twice.
- **Emails not sending**: Check your Resend API key and verify the sending domain.
- **Instantly integration not working**: Verify your Instantly API key and campaign ID.

## Security Considerations

- API keys are handled securely via environment variables
- Email validation is performed on both client and server
- CORS protection is implemented in the serverless function
- Rate limiting should be added for production use 