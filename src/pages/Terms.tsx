import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Terms = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Terms & Conditions | Backlink Bot";
  }, []);

  return (
    <>
      <Header />
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          <div className="bg-white shadow-sm rounded-lg p-8">
            <div className="prose prose-purple max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              
              <p className="mb-6">
                Welcome to Backlink Bot. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms. Please read them carefully.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using the Backlink Bot service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Service Description</h2>
              <p className="mb-4">
                Backlink Bot is a service that helps businesses submit their information to various online directories. We facilitate the submission process but cannot guarantee acceptance by every directory as each has its own editorial policies and standards.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. User Accounts and Responsibilities</h2>
              <p className="mb-4">
                To use our services, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information when creating an account and to update your information as needed.
              </p>
              <p className="mb-4">
                You are solely responsible for the content you submit through our service. By submitting content, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>You own or have the necessary rights and permissions to use all content you submit</li>
                <li>The content is accurate, truthful, and not misleading</li>
                <li>The content does not violate any applicable laws, regulations, or the rights of any third party</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Payments and Subscription</h2>
              <p className="mb-4">
                We offer various pricing plans for our services. By selecting a plan and providing payment information, you agree to pay all fees associated with your selected plan. All payments are processed securely through our payment processors.
              </p>
              <p className="mb-4">
                Prices for our services may change from time to time, and we will provide notice of any price changes before they take effect. By continuing to use our services after a price change, you accept the new prices.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Refund Policy</h2>
              <p className="mb-4">
                We only provide refunds in case we are unable to deliver the services within a week of filling the form from your end. In case we feel like the product doesn't resonate with the kind of directories we have, we will process your refund.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Data Security</h2>
              <p className="mb-4">
                We employ robust security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. We regularly review and update our security protocols to ensure the safety of your data.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Third-Party Links</h2>
              <p className="mb-4">
                Our website and services may contain links to third-party websites or services. We are not responsible for the content or privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Intellectual Property</h2>
              <p className="mb-4">
                All content on the Backlink Bot website, including text, graphics, logos, images, and software, is the property of Backlink Bot or its content suppliers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Limitation of Liability</h2>
              <p className="mb-4">
                To the maximum extent permitted by law, Backlink Bot and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill.
              </p>
              <p className="mb-4">
                We do not guarantee that all directory submissions will be accepted or that the use of our service will result in any specific increase in traffic, visibility, or business for you.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Indemnification</h2>
              <p className="mb-4">
                You agree to indemnify and hold harmless Backlink Bot, its affiliates, officers, employees, agents, partners, and licensors from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your use of our services, your violation of these Terms, or your violation of any rights of another.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Termination</h2>
              <p className="mb-4">
                We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">12. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the new Terms on our website or through other communication channels. Your continued use of our services after any changes to the Terms constitutes your acceptance of the new Terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">13. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">14. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us at team@backlinkbot.com.
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

export default Terms; 