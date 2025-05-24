import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-4">
            <div className="p-1 rounded-full bg-gray-200 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">FAQ's</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              What is BacklinkBot?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              BacklinkBot is an automated service that helps you submit your product or website to relevant directories to build backlinks. This helps improve your website's authority and visibility in search engines.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              How many backlinks does the bot give?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              The number of backlinks depends on your selected plan. The Starter plan includes submissions to 100+ directories, Pro plan to 200+ directories, and Elite plan to all available directories (500+).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              Which types of products or websites work best with BacklinkBot?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              BacklinkBot works best with SaaS products, mobile apps, startups, and small business websites. It's particularly effective for tech products, tools, and digital services that are looking to increase visibility in their niche.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              Is there a guarantee regarding the number of backlinks or the results?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              While we do our best to submit to quality directories, we cannot guarantee exact numbers as acceptance depends on individual directory policies. We focus on relevant, high-quality submissions rather than quantity.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              What if I have questions before or after making a purchase?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              Our customer support team is available to answer any questions you might have before or after your purchase. You can reach out via the contact form on our website or email us directly, and we'll respond within 24 hours.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              Is BacklinkBot fully automated?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              Yes, BacklinkBot is fully automated for you. Once you submit your product information, our human + AI system handles the entire process of finding relevant directories and submitting your information to them.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              I have already listed my product in directories. How is it helpful to me then?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              Even if you've manually listed your product in some directories, BacklinkBot can still help by submitting to directories you might have missed, saving you time on manual submissions, and ensuring a broader reach. Our database includes 1500+ carefully vetted directories that would take weeks to submit to manually.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              Can BacklinkBot help improve my website's domain rating?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              Yes, acquiring quality backlinks from reputable directories can improve your domain rating over time. While results vary depending on your niche and existing SEO profile, our clients typically see improvements in domain authority metrics within 30-90 days after submissions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              Does it list mobile apps as well?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              Yes, BacklinkBot can list both websites and mobile applications. We have directories specifically for mobile apps in our database.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10" className="bg-white rounded-lg shadow-sm border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              Is there a money-back guarantee?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service. If you don't see any new backlinks within 30 days of using our service, you can request a full refund by sending email. Please refer to refund policy for more details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQSection;
