import React from "react";

const featuredWebsites = [
  {
    title: "Tokgency",
    description: "Helping Brands with Tiktok Growth",
    image: "/tokgency.png", // Replace with your actual image path
    url:"https://tokgency.com",
    alt: "Helping Brands with Tiktok Growth",
  },
  {
    title: "EarlySEO",
    description: "Get Revenue Generating Traffic with AI-Assisted SEO - Google + LLM",
    image: "/earlyseo.png", // Replace with your actual image path
    url:"https://earlyseo.com",
    alt: "",
  },
  {
    title: "HookAds",
    description: "Convert your Ad viewers into Customers",
    image: "/hookads.png", // Replace with your actual image path
    url:"https://hookads.ai",
    alt: "",
  },
  {
    title: "XAutoDM",
    description: "Send Twitter DMs like it's cold emails",
    image: "/xautodm.png", // Replace with your actual image path
    url:"https://xautodm.com/",
    alt: "",
  },
];

const FeaturedWebsites: React.FC = () => {
  return (
    <section className="w-full bg-[#7c3aed] py-16 px-2 md:px-0">
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Checkout our other products</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredWebsites.map((site, idx) => (
          <a
            key={site.title}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400"
            tabIndex={0}
          >
            <div className="w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={site.image}
                alt={site.alt}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{site.title}</h3>
              <p className="text-gray-600 text-base md:text-lg">{site.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default FeaturedWebsites; 