import type { DirectorySubmission } from './googleSheets';

/**
 * Client-side function to submit directory data to the backend
 */
export async function submitDirectoryForm(formData: Omit<DirectorySubmission, 'submittedAt'>): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // In a production environment, replace this URL with your actual API endpoint
    const apiUrl = import.meta.env.VITE_API_URL || '/api/submit-directory';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // For non-2xx responses
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || `Server error: ${response.status}`,
      };
    }

    // Parse the successful response
    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
    };
  } catch (error) {
    console.error('Error submitting directory form:', error);
    return {
      success: false,
      message: 'Failed to submit form. Please check your connection and try again.',
    };
  }
} 