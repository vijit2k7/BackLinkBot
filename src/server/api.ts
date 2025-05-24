import { submitDirectory } from '../services/directorySubmission';
import type { DirectorySubmission } from '../services/googleSheets';

/**
 * API handler for directory submissions
 * 
 * This is a simplified version that can be adapted to different platforms:
 * - For Vercel: Export this as an API route
 * - For Netlify: Export as a serverless function
 * - For Express: Use as a route handler
 */
export async function handleDirectorySubmission(formData: Omit<DirectorySubmission, 'submittedAt'>) {
  try {
    // Process the submission
    const result = await submitDirectory(formData);
    
    return {
      statusCode: result.success ? 200 : 500,
      body: JSON.stringify({ 
        success: result.success,
        message: result.message
      })
    };
  } catch (error) {
    console.error('API handler error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        message: 'An unexpected error occurred processing your submission.' 
      })
    };
  }
}

// Example of how this would be used with different platforms:

// Vercel API Route (pages/api/submit-directory.ts)
// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
//   
//   const result = await handleDirectorySubmission(req.body);
//   return res.status(result.statusCode).json(JSON.parse(result.body));
// }

// Netlify Function (netlify/functions/submit-directory.js)
// exports.handler = async function(event, context) {
//   if (event.httpMethod !== 'POST') {
//     return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
//   }
//   
//   const formData = JSON.parse(event.body);
//   const result = await handleDirectorySubmission(formData);
//   return {
//     statusCode: result.statusCode,
//     body: result.body
//   };
// } 