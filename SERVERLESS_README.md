# Serverless Functions Setup Guide

This guide explains how to set up and troubleshoot the serverless functions used for email collection in the BacklinkBot website.

## Function Overview

There are three serverless functions in this project:

1. **submit-email.js**: Main function for email collection, Resend integration, and Instantly integration
2. **submit-email-simple.js**: Simplified fallback function that just logs emails (no external APIs)
3. **env-check.js**: A diagnostic function to check environment variables and dependencies

## Required Environment Variables

All functions require these environment variables to be set in your Netlify dashboard:

```
RESEND_API_KEY=your_resend_api_key
INSTANTLY_API_KEY=your_instantly_api_key  
INSTANTLY_CAMPAIGN_ID=your_campaign_id
EMAIL_FROM_NAME=Startup Directories
EMAIL_FROM_ADDRESS=your-verified-email@yourdomain.com
```

## Setup Instructions

### 1. Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to Site settings > Build & deploy > Environment
3. Add all the required environment variables
4. Click "Save"

### 2. Deploy the Functions

The functions will be automatically deployed when you push to your repository. You can also manually trigger a deployment:

1. Go to Netlify dashboard > Deploys
2. Click "Trigger deploy" > "Deploy site"

### 3. Test the Functions

After deployment, test if the functions are working:

1. **Check Environment**: Visit `https://your-site.netlify.app/.netlify/functions/env-check`
2. **Test Simple Function**: Submit an email through the form or make a direct POST request to `/.netlify/functions/submit-email-simple`

## Troubleshooting

### 502 Bad Gateway Errors

If you see 502 errors, check the following:

1. **Environment Variables**: Ensure all environment variables are set
2. **Function Logs**: Check logs in Netlify dashboard > Functions > Function name > Logs
3. **Dependencies**: Make sure `resend` is installed and configured in `functions/package.json`
4. **Node.js Version**: Ensure Node.js 18+ is used (set in netlify.toml)

### Resend Integration Issues

If emails aren't being sent:

1. **API Key**: Verify your Resend API key is correct
2. **Domain Verification**: Make sure your sending domain is verified in Resend
3. **Email Format**: Check that your email format follows `Name <email@domain.com>`

### Instantly Integration Issues

If emails aren't being added to campaigns:

1. **API Key**: Verify your Instantly API key
2. **Campaign ID**: Confirm your campaign ID exists and is active
3. **API Endpoint**: Check if the API endpoint is correct (https://api.instantly.ai/api/v1/lead/add)

## Fallback Strategy

The system uses a fallback strategy:
1. First attempts to use the main `submit-email` function
2. If that fails, tries the simplified `submit-email-simple` function
3. If both fail, displays an error to the user

This ensures emails are at least collected even if sending via Resend or adding to Instantly fails.

## Security Considerations

- API keys are stored as environment variables for security
- Functions use CORS headers to protect against cross-origin requests
- Form inputs are validated both client-side and server-side 