import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const BacklinkMetrics = () => {
  const metricsData = [
    {
      period: '7 days',
      metrics: {
        dr: { value: 15, increase: 5 },
        ur: { value: 18, increase: 1 },
        backlinks: { value: 248, increase: 149 },
        refDomains: { value: 21, increase: 6 },
        ar: { value: '14,645,727', increase: '6,873,247' }
      }
    },
    {
      period: '30 days',
      metrics: {
        dr: { value: 5, increase: 4.9 },
        ur: { value: 18, increase: 11 },
        backlinks: { value: 553, increase: 452 },
        refDomains: { value: 66, increase: 51 },
        ar: { value: '37,692,013', increase: '73,070,176' }
      }
    },
    {
      period: '3 months',
      metrics: {
        dr: { value: 15, increase: 6 },
        ur: { value: 20, increase: 6 },
        backlinks: { value: 231, increase: 78 },
        refDomains: { value: 80, increase: 26 },
        ar: { value: '16,149,131', increase: '9,547,792' }
      }
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full bg-purple-dark/20 text-purple-light">
            <span className="mr-1">📈</span>
            <span>REAL RESULTS</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Backlink Growth You Can Measure
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-4">
            Our clients see significant improvements in key SEO metrics. Here's what you can expect:
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 p-6">
          {/* Combined view with results and approach */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Real Client Results</h3>
              <img 
                src="/lovable-uploads/14dae4e2-3fe9-49b9-af83-c3ac17e621ac.png" 
                alt="Backlink profile metrics showing growth" 
                className="w-full rounded-lg mb-6"
              />
            </div>

            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Our Unique Methodology</h3>
              <p className="text-gray-600 mb-4">
                Unlike traditional link building services, we focus on creating genuine relationships with high-authority websites in your niche.
              </p>
              <p className="text-gray-600 mb-4">
                Our proprietary outreach system identifies the perfect link opportunities for your specific industry, ensuring relevant, powerful, and sustainable backlinks.
              </p>
              <p className="text-gray-600">
                We don't just build links - we build your site's authority through strategic placements that send strong relevancy signals to search engines.
              </p>
            </div>
          </div>

          {/* Metrics cards row */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {metricsData.map((data, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Changes: Last {data.period}
                  </h3>
                  <div className="inline-flex items-center text-xs text-gray-500">
                    <span className="mr-1">All locations</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">DR</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">
                        {data.metrics.dr.value}
                      </span>
                      <span className="text-green-500 text-sm">
                        +{data.metrics.dr.increase}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">UR</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">
                        {data.metrics.ur.value}
                      </span>
                      <span className="text-green-500 text-sm">
                        +{data.metrics.ur.increase}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Backlinks</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-600 mr-2">
                        {data.metrics.backlinks.value}
                      </span>
                      <span className="text-green-500 text-sm">
                        +{data.metrics.backlinks.increase}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ref. domains</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-600 mr-2">
                        {data.metrics.refDomains.value}
                      </span>
                      <span className="text-green-500 text-sm">
                        +{data.metrics.refDomains.increase}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* Key features of the approach */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">What Makes Our Approach Different</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">Quality Over Quantity</h4>
                <p className="text-gray-600 text-sm">
                  We target only high DR sites with real traffic, ensuring each link drives maximum SEO value.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">Contextual Placement</h4>
                <p className="text-gray-600 text-sm">
                  Links are placed within relevant content sections that match your niche for better topical relevance.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">Natural Link Velocity</h4>
                <p className="text-gray-600 text-sm">
                  Links are built at a pace that appears natural to search engines, avoiding potential penalties.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">Diverse Link Profile</h4>
                <p className="text-gray-600 text-sm">
                  We ensure a mix of authority sites, anchor texts, and page types to create a balanced backlink profile.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="#cta" 
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors"
            >
              Get similar results for your website
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklinkMetrics;
