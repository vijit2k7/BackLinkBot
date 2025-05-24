import { useEffect } from 'react';

const TestimonialWidget = () => {
  useEffect(() => {
    // Load the Senja widget script with the specific widget ID
    const script = document.createElement('script');
    script.src = "https://widget.senja.io/widget/e78e9276-578f-4d7a-92b2-c9720182b0d1/platform.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full bg-purple-dark/20 text-purple-light">
            <span className="mr-1">💬</span>
            <span>TRUSTED BY FOUNDERS</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of satisfied founders who have boosted their online presence with BacklinkBot
          </p>
        </div>
        
        <div className="testimonial-widget-container">
          {/* Senja Widget using exact configuration provided */}
          <div 
            className="senja-embed" 
            data-id="e78e9276-578f-4d7a-92b2-c9720182b0d1"
            data-mode="shadow"
            data-lazyload="false"
            style={{ display: 'block', width: '100%', maxWidth: '100%', margin: '0 auto' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialWidget;
