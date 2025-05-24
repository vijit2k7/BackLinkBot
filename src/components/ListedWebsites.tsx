import { useRef, useState, useEffect } from "react";

interface Website {
  id: number;
  url: string;
  domainRating: number;
  backlinks: string;
  percentFollow: number;
  growth: number;
}

const ListedWebsites = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const websites: Website[] = [
    {
      id: 1,
      url: "virlo.ai",
      domainRating: 27,
      backlinks: "1.3K",
      percentFollow: 63,
      growth: 12
    },
    {
      id: 2,
      url: "blackink.ai",
      domainRating: 35,
      backlinks: "10.5K",
      percentFollow: 66,
      growth: 20
    },
    {
      id: 3,
      url: "fasterthannormal.co",
      domainRating: 12,
      backlinks: "321",
      percentFollow: 87,
      growth: 15
    },
    {
      id: 4,
      url: "aimathsolve.com",
      domainRating: 26,
      backlinks: "1.6K",
      percentFollow: 76,
      growth: 16
    },
    {
      id: 5,
      url: "aimdoc.ai",
      domainRating: 19,
      backlinks: "2.0K",
      percentFollow: 56,
      growth: 25
    },
    {
      id: 6,
      url: "mystoryelf.com",
      domainRating: 11,
      backlinks: "8.4K",
      percentFollow: 53,
      growth: 18
    },
    {
      id: 7,
      url: "priveeai.com",
      domainRating: 35,
      backlinks: "11.9k",
      percentFollow: 46,
      growth: 22
    },
    {
      id: 8, 
      url: "formity.app",
      domainRating: 27,
      backlinks: "205",
      percentFollow: 89,
      growth: 18
    },
    {
      id: 9,
      url: "hey.kwakwa.com",
      domainRating: 40,
      backlinks: "724",
      percentFollow: 91,
      growth: 22
    },
    {
      id: 10,
      url: "apxml.com",
      domainRating: 25,
      backlinks: "1.2k",
      percentFollow: 64,
      growth: 22
    },
    {
      id: 11,
      url: "xbanking.org",
      domainRating: 37,
      backlinks: "6.3k",
      percentFollow: 31,
      growth: 22
    },
    {
      id: 12,
      url: "shortsninja.com",
      domainRating: 10,
      backlinks: "9.3k",
      percentFollow: 63,
      growth: 22
    },
    {
      id: 13,
      url: "segwise.ai",
      domainRating: 26,
      backlinks: "1.3k",
      percentFollow: 72,
      growth: 22
    },
    {
      id: 14,
      url: "colorify.rocks",
      domainRating: 26,
      backlinks: "14.5k",
      percentFollow: 52,
      growth: 22
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastScrollPosition = container.scrollLeft;
    let scrollSpeed = 1; // pixels per frame

    const scroll = () => {
      if (container && !isPaused) {
        // If we're near the end of the original content, reset to start
        if (container.scrollLeft >= (container.scrollWidth / 2) - 50) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollSpeed;
        }
        
        // Check if scrolling actually happened
        if (container.scrollLeft === lastScrollPosition && container.scrollLeft !== 0) {
          // If we couldn't scroll further, reset to beginning
          container.scrollLeft = 0;
        }
        
        lastScrollPosition = container.scrollLeft;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(scroll);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  // Create a seamless loop by duplicating the websites array
  const extendedWebsites = [...websites, ...websites];

  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Startups who trust BacklinkBot...</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse some of the startups we've helped climb the SEO ranks with our powerful backlink strategy
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {extendedWebsites.map((site, index) => (
              <div 
                key={`${site.id}-${index}`}
                className="flex-shrink-0 w-[280px] mx-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-purple font-medium hover:underline truncate max-w-[180px]">
                    {site.url.replace('https://', '')}
                  </a>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{site.growth}%
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">Domain Rating</span>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                        {site.domainRating}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">Backlinks</span>
                    <span className="text-2xl font-bold text-gray-800">{site.backlinks}</span>
                    <span className="text-xs text-gray-500 mt-1">{site.percentFollow}% do follow</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedWebsites;
