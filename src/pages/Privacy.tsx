import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Privacy = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Privacy Policy | Backlink Bot";
  }, []);

  return (
    <>
      <Header />
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <div className="bg-white shadow-sm rounded-lg p-8">
            <div className="prose prose-purple max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              
              <p className="mb-6">
                At Backlink Bot, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">1.1 Personal Information</h3>
              <p className="mb-4">
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Create an account or register on our website</li>
                <li>Fill out forms to use our directory submission services</li>
                <li>Contact us or request information about our services</li>
                <li>Subscribe to our newsletter or marketing communications</li>
              </ul>
              
              <p className="mb-4">
                The personal information we collect may include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Contact information (name, email address, phone number)</li>
                <li>Billing information (payment method details, billing address)</li>
                <li>Account credentials (username, password)</li>
                <li>Your startup or business information (company name, website URL, business description, founding date, team size, etc.)</li>
                <li>Social media profiles and links related to your business</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">1.2 Directory Submission Information</h3>
              <p className="mb-4">
                To facilitate directory submissions on your behalf, we collect specific information about your business or startup, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Business name, URL, and description</li>
                <li>Business category and tags</li>
                <li>Founding information</li>
                <li>Product or service details</li>
                <li>Logo and other brand assets</li>
                <li>Founder information</li>
                <li>Social media profiles</li>
              </ul>
              
              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">1.3 Technical Information</h3>
              <p className="mb-4">
                We automatically collect certain information when you visit our website, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Referral source</li>
                <li>Length of visit and pages viewed</li>
                <li>Other browsing information</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Providing and maintaining our services</li>
                <li>Submitting your business information to various directories on your behalf</li>
                <li>Processing transactions and managing your account</li>
                <li>Sending administrative information, service updates, and marketing communications</li>
                <li>Responding to your inquiries and support requests</li>
                <li>Improving our website and services</li>
                <li>Protecting against fraudulent or unauthorized activity</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Information Sharing and Disclosure</h2>
              <p className="mb-4">
                We may share your information with third parties in the following circumstances:
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3.1 Directory Submissions</h3>
              <p className="mb-4">
                The primary purpose of our service is to submit your business information to various online directories. By using our service, you explicitly authorize us to share your business and personal information with these third-party directories in accordance with their submission requirements.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3.2 Service Providers</h3>
              <p className="mb-4">
                We may share your information with third-party service providers who help us operate our business and deliver services, such as:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Payment processors</li>
                <li>Cloud storage providers</li>
                <li>Email service providers</li>
                <li>Analytics services</li>
                <li>Customer support tools</li>
              </ul>
              <p className="mb-4">
                These service providers are only authorized to use your information as necessary to provide services to us and are required to maintain the confidentiality of your information.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3.3 Legal Requirements</h3>
              <p className="mb-4">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
              </p>

              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3.4 Business Transfers</h3>
              <p className="mb-4">
                If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. We regularly review and update our security protocols to ensure the ongoing integrity and confidentiality of your data.
              </p>
              <p className="mb-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Your Data Protection Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access: You can request copies of your personal information</li>
                <li>Rectification: You can request that we correct inaccurate information</li>
                <li>Erasure: You can request that we delete your personal information</li>
                <li>Restriction: You can request that we restrict the processing of your information</li>
                <li>Data portability: You can request the transfer of your information to another organization</li>
                <li>Objection: You can object to the processing of your personal information</li>
              </ul>
              <p className="mb-4">
                To exercise any of these rights, please contact us at amplifyxlabsteam@gmail.com  
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Children's Privacy</h2>
              <p className="mb-4">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us so we can promptly remove the information.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Third-Party Links</h2>
              <p className="mb-4">
                Our website may contain links to third-party websites or services. We are not responsible for the content or privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mb-4">
                Email: amplifyxlabsteam@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default Privacy; 