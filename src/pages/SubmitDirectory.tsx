import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { CheckCircle, ExternalLink, Info, AlertTriangle } from "lucide-react";
import { submitEmail } from "@/lib/api";
import axios from "axios";

// Add API keys
const REOON_API_KEY = import.meta.env.VITE_REOON_EMAIL_VERIFIER_API_KEY;
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const EMAIL_FROM = import.meta.env.VITE_EMAIL_FROM_ADDRESS;
const EMAIL_FROM_NAME = import.meta.env.VITE_EMAIL_FROM_NAME;

interface EmailVerificationResponse {
  email: string;
  status: 'valid' | 'invalid' | 'disposable' | 'spamtrap';
  username: string;
  domain: string;
  is_valid_syntax: boolean;
  is_disposable: boolean;
  is_role_account: boolean;
  mx_accepts_mail: boolean;
  is_spamtrap: boolean;
  is_free_email: boolean;
}

const verifyEmail = async (email: string): Promise<EmailVerificationResponse> => {
  try {
    const response = await fetch(`https://emailverifier.reoon.com/api/v1/verify?email=${encodeURIComponent(email)}&key=${REOON_API_KEY}&mode=quick`);
    if (!response.ok) {
      throw new Error('Email verification failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw new Error('Failed to verify email');
  }
};

const SubmitDirectory = () => {
  const [formState, setFormState] = useState({
    directoryName: "",
    directoryUrl: "",
    domainRating: "",
    category: "",
    submissionType: "",
    submissionUrl: "",
    fee: "",
    turnaroundTime: "",
    contactEmail: "",
    additionalInfo: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailValidationMessage, setEmailValidationMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    setIsSubmitting(false);
    setSuccessMessage("Thank you for your submission! We'll review it and get back to you soon.");
    setFormState({
      directoryName: "",
      directoryUrl: "",
      domainRating: "",
      category: "",
      submissionType: "",
      submissionUrl: "",
      fee: "",
      turnaroundTime: "",
      contactEmail: "",
      additionalInfo: "",
    });
    setTimeout(() => {
      setSuccessMessage(null);
    }, 8000);
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Submit Directory | Backlink Bot";
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setEmailValidationMessage(null);
    
    try {
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formState.contactEmail || !emailRegex.test(formState.contactEmail)) {
        setEmailValidationMessage("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      // Verify email first
      const verificationResult = await verifyEmail(formState.contactEmail);
      console.log('Verification result:', verificationResult);
      
      let shouldBlock = false;
      let blockReason = "";

      // Handle different verification scenarios
      if (!verificationResult.is_valid_syntax) {
        shouldBlock = true;
        blockReason = "The email format appears to be invalid. Please check for typos.";
      } else if (verificationResult.is_disposable || verificationResult.status === 'disposable') {
        shouldBlock = true;
        blockReason = "We don't accept temporary or disposable email addresses. Please use your regular email address.";
      } else if (verificationResult.is_spamtrap || verificationResult.status === 'spamtrap') {
        shouldBlock = true;
        blockReason = "This email address has been flagged as potentially harmful. Please use a different email address.";
      } else if (verificationResult.is_role_account) {
        shouldBlock = true;
        blockReason = "We don't accept role-based email addresses (like info@, support@, etc.). Please use your personal work email.";
      } else if (!verificationResult.mx_accepts_mail) {
        shouldBlock = true;
        blockReason = "This email domain doesn't appear to accept mail. Please check the spelling or use a different email address.";
      } else if (verificationResult.status === 'invalid') {
        shouldBlock = true;
        blockReason = "This email address appears to be invalid. Please double-check and try again.";
      }

      // If email validation failed, show the specific error and return
      if (shouldBlock) {
        setEmailValidationMessage(blockReason);
        setIsSubmitting(false);
        return;
      }

      // If email is valid, send email via Resend
      try {
        const emailResponse = await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
            to: formState.contactEmail,
            subject: 'Directory Submission Received - Backlink Bot',
            html: `
              <h1>Thank you for submitting your directory!</h1>
              <p>We have received your directory submission for ${formState.directoryName}.</p>
              <h2>Submission Details:</h2>
              <ul>
                <li><strong>Directory Name:</strong> ${formState.directoryName}</li>
                <li><strong>URL:</strong> ${formState.directoryUrl}</li>
                <li><strong>Domain Rating:</strong> ${formState.domainRating}</li>
                <li><strong>Category:</strong> ${formState.category}</li>
                <li><strong>Submission Type:</strong> ${formState.submissionType}</li>
                ${formState.fee ? `<li><strong>Fee:</strong> ${formState.fee}</li>` : ''}
                ${formState.turnaroundTime ? `<li><strong>Turnaround Time:</strong> ${formState.turnaroundTime}</li>` : ''}
              </ul>
              <p>Our team will review your submission and get back to you if we need any additional information.</p>
              <p>Best regards,<br>The Backlink Bot Team</p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't block form submission if email fails
      }

      // Add email to Google Sheet
      try {
        const baseUrl = import.meta.env.DEV ? 'http://localhost:9999' : '';
        const sheetResponse = await fetch(`${baseUrl}/.netlify/functions/add-to-sheet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'omit',
          body: JSON.stringify({
            email: formState.contactEmail,
            directoryName: formState.directoryName,
            directoryUrl: formState.directoryUrl,
            domainRating: formState.domainRating,
            category: formState.category,
            submissionType: formState.submissionType,
            submissionUrl: formState.submissionUrl,
            fee: formState.fee || 'Not specified',
            turnaroundTime: formState.turnaroundTime || 'Not specified',
            contactEmail: formState.contactEmail,
            additionalInfo: formState.additionalInfo || 'None',
            submissionDate: new Date().toISOString(),
            status: 'Pending Review',
            source: 'directory-submission'
          })
        });

        if (!sheetResponse.ok) {
          const errorText = await sheetResponse.text();
          console.error('Failed to add to sheet:', errorText);
          // Don't block form submission if sheet addition fails
        } else {
          const result = await sheetResponse.json();
          console.log('Sheet response:', result);
        }
      } catch (sheetError) {
        console.error('Error adding to sheet:', sheetError);
        // Don't block form submission if sheet addition fails
      }

      // Submit to Netlify's form handler
      try {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // In development, we'll simulate a successful form submission
        // In production, Netlify will handle the form submission
        if (import.meta.env.DEV) {
          // Log form data in development
          const formObject = Object.fromEntries(formData.entries());
          console.log('Form data:', formObject);
          
          // Simulate successful submission
          setTimeout(() => {
            setIsSubmitted(true);
            handleSuccess();
          }, 500);
        } else {
          // In production, submit to Netlify
          try {
            await fetch("/", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams(formData as any).toString(),
            });
            setIsSubmitted(true);
            handleSuccess();
          } catch (netlifyError) {
            console.error("Netlify form submission error:", netlifyError);
            // Still show success if the other operations succeeded
            setIsSubmitted(true);
            handleSuccess();
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setError("Form submission failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again later.");
      console.error("Directory submission error:", err);
    }
  };
  
  // Check for success parameter in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setIsSubmitted(true);
      // Reset form
      setFormState({
        directoryName: "",
        directoryUrl: "",
        domainRating: "",
        category: "",
        submissionType: "",
        submissionUrl: "",
        fee: "",
        turnaroundTime: "",
        contactEmail: "",
        additionalInfo: "",
      });
      // Clear the URL parameter without refreshing the page
      window.history.replaceState({}, '', window.location.pathname);
      // Reset success message after 8 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 8000);
    }
  }, []);

  return (
    <>
      <Header />
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hidden form for Netlify form detection */}
          <form name="directory-submission" data-netlify="true" hidden>
            <input type="text" name="directoryName" />
            <input type="url" name="directoryUrl" />
            <input type="number" name="domainRating" />
            <input type="text" name="category" />
            <input type="text" name="submissionType" />
            <input type="url" name="submissionUrl" />
            <input type="text" name="fee" />
            <input type="text" name="turnaroundTime" />
            <input type="email" name="contactEmail" />
            <textarea name="additionalInfo"></textarea>
          </form>

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Directory</h1>
            <p className="text-xl text-gray-600">
              Help us grow our directory database and support the startup ecosystem. Submit your directory details below.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {isSubmitted ? (
                <div className="bg-green-50 p-6 rounded-lg text-center mb-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Thanks for your submission!
                  </h3>
                  <p className="text-gray-600">
                    {successMessage}
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg flex items-start mb-8">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-blue-700 text-sm">
                      We're always looking to expand our list of quality directories. If your directory meets our quality standards, we'll add it to our submission list. Please provide detailed and accurate information to help us evaluate your directory.
                    </p>
                  </div>
                
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
                      {error}
                    </div>
                  )}
                
                  <form 
                    onSubmit={handleSubmit}
                    name="directory-submission"
                    method="POST"
                    action="/"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                  >
                    {/* Hidden Netlify form fields */}
                    <input type="hidden" name="form-name" value="directory-submission" />
                    <input type="hidden" name="bot-field" />
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="directoryName" className="block text-sm font-medium text-gray-700 mb-1">
                            Directory Name *
                          </label>
                          <input
                            type="text"
                            id="directoryName"
                            name="directoryName"
                            value={formState.directoryName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                            placeholder="e.g., ProductHunt"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="directoryUrl" className="block text-sm font-medium text-gray-700 mb-1">
                            Directory URL *
                          </label>
                          <input
                            type="url"
                            id="directoryUrl"
                            name="directoryUrl"
                            value={formState.directoryUrl}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="domainRating" className="block text-sm font-medium text-gray-700 mb-1">
                            Domain Rating (DR) *
                          </label>
                          <input
                            type="number"
                            id="domainRating"
                            name="domainRating"
                            min="0"
                            max="100"
                            value={formState.domainRating}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                            placeholder="e.g., 65"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Directory Category *
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formState.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                          >
                            <option value="">Select a category</option>
                            <option value="general">General</option>
                            <option value="startup">Startup</option>
                            <option value="tech">Tech</option>
                            <option value="saas">SaaS</option>
                            <option value="marketing">Marketing</option>
                            <option value="business">Business</option>
                            <option value="design">Design</option>
                            <option value="product">Product</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="submissionType" className="block text-sm font-medium text-gray-700 mb-1">
                          Submission Type *
                        </label>
                        <select
                          id="submissionType"
                          name="submissionType"
                          value={formState.submissionType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                        >
                          <option value="">Select submission type</option>
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                          <option value="freemium">Freemium (Free + Paid options)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="submissionUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          Submission URL *
                        </label>
                        <input
                          type="url"
                          id="submissionUrl"
                          name="submissionUrl"
                          value={formState.submissionUrl}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                          placeholder="https://example.com/submit"
                        />
                        <p className="mt-1 text-sm text-gray-500">Direct link to the submission page</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-1">
                            Submission Fee (if any)
                          </label>
                          <input
                            type="text"
                            id="fee"
                            name="fee"
                            value={formState.fee}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                            placeholder="e.g., $50 one-time / Free"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="turnaroundTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Typical Turnaround Time
                          </label>
                          <input
                            type="text"
                            id="turnaroundTime"
                            name="turnaroundTime"
                            value={formState.turnaroundTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                            placeholder="e.g., 2-3 business days"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Contact Email *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="contactEmail"
                            name="contactEmail"
                            value={formState.contactEmail}
                            onChange={(e) => {
                              handleChange(e);
                              setEmailValidationMessage(null);
                            }}
                            required
                            className={`w-full px-4 py-2 border rounded-md focus:ring-purple focus:border-purple transition-all duration-300
                              ${emailValidationMessage 
                                ? 'border-red-300 focus:border-red-400 bg-red-50/30' 
                                : 'border-gray-300 focus:border-purple hover:border-gray-400'}
                              ${formState.contactEmail ? 'bg-gray-50/30' : ''}`}
                            placeholder="your@email.com"
                          />
                        </div>
                        {emailValidationMessage && (
                          <div className="mt-2 flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{emailValidationMessage}</span>
                          </div>
                        )}
                        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                          <Info className="h-4 w-4" />
                          We'll contact you if we need more information
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Information
                        </label>
                        <textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          rows={4}
                          value={formState.additionalInfo}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple focus:border-purple"
                          placeholder="Any other details about the directory that might be helpful for our review process..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple transition-colors disabled:opacity-70"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Directory"}
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
            
            {/* Additional Info Section */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What makes a good directory?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>High domain authority (DR 40+)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Regular updates and maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Relevant categorization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Good user experience and design</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Quality content and listings</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our review process</h3>
                <p className="text-gray-600 mb-4">
                  We carefully review all submitted directories to ensure they meet our quality standards. Our team checks for:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Domain authority and backlink profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Relevance to our user base</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Submission process and user experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Overall quality and professionalism</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 bg-purple-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-purple mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Already have a list of directories?</h3>
                  <p className="text-gray-600 mb-4">
                    If you manage multiple directories or have a compiled list, feel free to contact us directly instead of submitting them one by one.
                  </p>
                  <a 
                    href="mailto:amplifyxlabsteam@gmail.com?subject=Directory%20List%20Submission" 
                    className="inline-flex items-center text-purple hover:text-purple-dark font-medium"
                  >
                    Email Us Your List amplifyxlabsteam@gmail.com <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default SubmitDirectory; 