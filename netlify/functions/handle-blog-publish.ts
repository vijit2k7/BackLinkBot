import { Handler } from '@netlify/functions';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const handler: Handler = async (event) => {
  // Only proceed for POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Parse the incoming webhook payload
    const payload = JSON.parse(event.body || '{}');
    
    // Only proceed if this is a blog post publish event
    if (payload.collection === 'blog') {
      console.log('Blog post published, regenerating content...');
      
      // Run our content generation scripts
      const scriptsDir = path.join(process.cwd(), 'scripts');
      
      // Run copy-blog-content.js
      await execAsync(`node ${path.join(scriptsDir, 'copy-blog-content.js')}`);
      console.log('Blog content copied successfully');
      
      // Run generate-blog-index.js
      await execAsync(`node ${path.join(scriptsDir, 'generate-blog-index.js')}`);
      console.log('Blog index generated successfully');
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Blog content updated successfully' })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'No action needed' })
    };
  } catch (error) {
    console.error('Error handling blog publish:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating blog content' })
    };
  }
};

export { handler }; 