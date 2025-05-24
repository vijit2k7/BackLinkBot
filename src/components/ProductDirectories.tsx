import { useState } from 'react';
import { ArrowUpRight, Search, SlidersHorizontal, ChevronDown, ArrowUpDown, ChevronRight, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ProductDirectories = () => {
  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [impactFilter, setImpactFilter] = useState('All Impact Levels');
  const [linkTypeFilter, setLinkTypeFilter] = useState('All Link Types');
  const [sortBy, setSortBy] = useState('Sort by Impact');
  const [showAllDirectories, setShowAllDirectories] = useState(false);
  const [initialDisplayCount, setInitialDisplayCount] = useState(9);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setImpactFilter('All Impact Levels');
    setLinkTypeFilter('All Link Types');
    setSortBy('Sort by Impact');
  };

  // Expanded directories list with DA scores and follow status
  const directories = [
    // High impact directories
    {
      name: 'Product Hunt',
      da: 91,
      impact: 'high',
      followStatus: 'dofollow',
      url: 'http://producthunt.com/posts/new'
    },
    {
      name: 'About.me',
      da: 90,
      impact: 'high',
      followStatus: 'nofollow',
      url: 'http://about.me/signup/start'
    },
    {
      name: 'Crunchbase',
      da: 90,
      impact: 'high',
      followStatus: 'nofollow',
      url: 'http://crunchbase.com/add-new'
    },
    {
      name: 'Hacker News',
      da: 90,
      impact: 'high',
      followStatus: 'dofollow',
      url: 'http://news.ycombinator.com/submit'
    },
    {
      name: 'F6S',
      da: 82,
      impact: 'high',
      followStatus: 'nofollow',
      url: 'https://f6s.com/'
    },
    {
      name: 'DealRoom',
      da: 76,
      impact: 'high',
      followStatus: 'dofollow',
      url: 'https://app.dealroom.co/companies/fintern'
    },
    {
      name: 'AppSumo',
      da: 82,
      impact: 'high',
      followStatus: 'dofollow',
      url: 'https://appsumo.com/'
    },
    {
      name: 'G2',
      da: 91,
      impact: 'high',
      followStatus: 'nofollow',
      url: 'https://www.g2.com/'
    },
    {
      name: 'GoodFirms',
      da: 85,
      impact: 'high',
      followStatus: 'nofollow',
      url: 'https://www.goodfirms.co/'
    },
    // Medium impact directories
    {
      name: 'GeekWire',
      da: 88,
      impact: 'medium',
      followStatus: 'nofollow',
      url: 'https://www.geekwire.com/'
    },
    {
      name: 'AlternativeTo',
      da: 80,
      impact: 'medium',
      followStatus: 'nofollow',
      url: 'http://alternativeto.net/manage-item'
    },
    {
      name: 'Indie Hackers',
      da: 80,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://indiehackers.com/new-product'
    },
    {
      name: 'Read.cv',
      da: 80,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://read.cv/'
    },
    {
      name: 'CrozDesk',
      da: 75,
      impact: 'medium',
      followStatus: 'nofollow',
      url: 'http://vendor.softwareselect.com/user/signup'
    },
    {
      name: 'SoftwareWorld',
      da: 74,
      impact: 'medium',
      followStatus: 'nofollow',
      url: 'http://softwareworld.co/register'
    },
    {
      name: 'BetaList',
      da: 73,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://betalist.com/submissions/new'
    },
    {
      name: 'SaaSworthy',
      da: 73,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://saasworthy.com/offerings'
    },
    {
      name: 'Alternative.me',
      da: 72,
      impact: 'medium',
      followStatus: 'nofollow',
      url: 'http://alternative.me/how-to/submit-software'
    },
    {
      name: 'SaaSHub',
      da: 71,
      impact: 'medium',
      followStatus: 'nofollow',
      url: 'http://saashub.com/submit'
    },
    {
      name: 'Futurepedia',
      da: 71,
      impact: 'medium',
      followStatus: 'nofollow',
      url: 'https://www.futurepedia.io/'
    },
    {
      name: 'SideProjectors',
      da: 70,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'https://www.sideprojectors.com/'
    },
    {
      name: 'Tekpon',
      da: 69,
      impact: 'medium',
      followStatus: 'nofollow',
      url: 'http://tekpon.com/get-listed'
    },
    {
      name: 'Startup Fame',
      da: 69,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'https://startupfa.me/'
    },
    {
      name: 'Dang',
      da: 67,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://dang.ai/submit'
    },
    {
      name: 'Startup Stash',
      da: 67,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'https://startupstash.com/add-listing'
    },
    {
      name: 'Peerlist',
      da: 66,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'https://peerlist.io/'
    },
    {
      name: 'Future Tools',
      da: 62,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://futuretools.io/submit-a-tool'
    },
    {
      name: 'Uneed',
      da: 61,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://uneed.best/submit-a-tool'
    },
    {
      name: 'Fazier',
      da: 59,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'https://fazier.com/'
    },
    {
      name: 'Tiny Launch',
      da: 53,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'https://www.tinylaun.ch/'
    },
    {
      name: 'MicroLaunch',
      da: 44,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://tally.so/r/mYaR6N'
    },
    {
      name: 'Toolfolio',
      da: 27,
      impact: 'medium',
      followStatus: 'dofollow',
      url: 'http://toolfolio.io/'
    },
    // Low impact directories
    {
      name: 'SourceForge',
      da: 92,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'https://sourceforge.net/software/vendors/new'
    },
    {
      name: 'StartupRanking',
      da: 66,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'https://www.startupranking.com/'
    },
    {
      name: 'PitchWall',
      da: 65,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'https://pitchwall.co/'
    },
    {
      name: 'Makerlog',
      da: 58,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'https://getmakerlog.com/'
    },
    {
      name: 'Devhunt',
      da: 56,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://devhunt.org/'
    },
    {
      name: 'Dev Hunt',
      da: 56,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://devhunt.org/login'
    },
    {
      name: 'SaaS AI Tools',
      da: 56,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'http://saasaitools.com/join'
    },
    {
      name: 'WIP',
      da: 55,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'http://wip.co/projects/new'
    },
    {
      name: 'FiveTaco',
      da: 54,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://fivetaco.com/submit'
    },
    {
      name: 'StartupBase',
      da: 52,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://startupbase.io/submit'
    },
    {
      name: 'Indie Deals',
      da: 50,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://www.indie.deals/'
    },
    {
      name: "Ben's Bites News",
      da: 45,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'http://news.bensbites.co/submit'
    },
    {
      name: 'BigStartups',
      da: 45,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://bigstartups.co/'
    },
    {
      name: 'Insidr AI Tools',
      da: 45,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://insidr.ai/submit-tools'
    },
    {
      name: 'Workspaces',
      da: 45,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://workspaces.xyz/submit-a-workspace-workspaces'
    },
    {
      name: 'Mars AI Directory',
      da: 44,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'https://marsx.dev/ai-startups'
    },
    {
      name: 'Tiny Startups',
      da: 44,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://tally.so/r/wMzP8X'
    },
    {
      name: 'NoCodeList',
      da: 42,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://nocodelist.co/submit'
    },
    {
      name: 'Toolio',
      da: 40,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://toolio.ai/'
    },
    {
      name: 'OpenAlternative',
      da: 36,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://openalternative.co/submit'
    },
    {
      name: 'Promote Project',
      da: 34,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://www.promoteproject.com/'
    },
    {
      name: 'Startuplister',
      da: 33,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'http://startuplister.com/'
    },
    {
      name: '1000 Tools',
      da: 31,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://1000.tools/'
    },
    {
      name: '10words',
      da: 27,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://portal.10words.io/submissions/submit'
    },
    {
      name: 'IndieHackerStacks',
      da: 27,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://indiehackerstacks.com/'
    },
    {
      name: 'Startup Inspire',
      da: 27,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://startupinspire.com/dashboard/startup/create'
    },
    {
      name: 'Startup Spotlight',
      da: 25,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'http://tally.so/r/nrLJRp'
    },
    {
      name: 'Startups.fyi',
      da: 22,
      impact: 'low',
      followStatus: 'nofollow',
      url: 'http://tally.so/r/3lOGLk'
    },
    {
      name: 'Insanely Cool Tools',
      da: 16,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'http://insanelycooltools.com/submit-tool'
    },
    {
      name: 'GetByte',
      da: 11,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://www.getbyte.tech/'
    },
    {
      name: 'PrimeIndies',
      da: 4,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://primeindies.com/'
    },
    {
      name: 'SaasScape',
      da: 4,
      impact: 'low',
      followStatus: 'dofollow',
      url: 'https://saascape.io/'
    }
  ];

  // Filtering and sorting logic
  const filteredDirectories = directories.filter(dir => {
    const matchesSearch = dir.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesImpact = impactFilter === 'All Impact Levels' || dir.impact === impactFilter.toLowerCase();
    const matchesLinkType = linkTypeFilter === 'All Link Types' || 
      (linkTypeFilter === 'Dofollow' && dir.followStatus === 'dofollow') ||
      (linkTypeFilter === 'Nofollow' && dir.followStatus === 'nofollow');
    
    return matchesSearch && matchesImpact && matchesLinkType;
  }).sort((a, b) => {
    if (sortBy === 'Sort by DA (High to Low)') {
      return b.da - a.da;
    } else if (sortBy === 'Sort by DA (Low to High)') {
      return a.da - b.da;
    } else if (sortBy === 'Sort by Name') {
      return a.name.localeCompare(b.name);
    }
    // Default: Sort by Impact
    const impactOrder = { high: 3, medium: 2, low: 1 };
    return impactOrder[b.impact] - impactOrder[a.impact];
  });

  // Slice the array to show only the initial directories if not showing all
  const displayedDirectories = showAllDirectories || searchTerm || impactFilter !== 'All Impact Levels' || linkTypeFilter !== 'All Link Types' 
    ? filteredDirectories 
    : filteredDirectories.slice(0, initialDisplayCount);

  const hasMoreDirectories = filteredDirectories.length > displayedDirectories.length;

  const getImpactColor = (impact) => {
    if (impact === 'high') return 'bg-green-100 text-green-800';
    if (impact === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800'; // For low impact
  };

  const getFollowStatusStyle = (status) => {
    return status === 'dofollow' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full bg-purple-dark/20 text-purple-light">
            <span className="mr-1">🔎</span>
            <span>DIRECTORY DATABASE</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            1500+ High Authority Directories
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Manually submitting to these directories takes hours. Let BacklinkBot automate the process for you.
          </p>
        </div>

        {/* Filtering and Sorting UI */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="text-lg font-semibold">Filter & Sort Sites</h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-grow md:flex-grow-0">
                <select 
                  className="appearance-none border border-blue-500 rounded-lg px-4 py-2 pr-10 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Sort by Impact</option>
                  <option>Sort by DA (High to Low)</option>
                  <option>Sort by DA (Low to High)</option>
                  <option>Sort by Name</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center whitespace-nowrap"
                onClick={resetFilters}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-lg w-full px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple"
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value)}
              >
                <option>All Impact Levels</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-lg w-full px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple"
                value={linkTypeFilter}
                onChange={(e) => setLinkTypeFilter(e.target.value)}
              >
                <option>All Link Types</option>
                <option>Dofollow</option>
                <option>Nofollow</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search sites..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedDirectories.map((directory) => (
            <div
              key={directory.name}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">{directory.name}</h3>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getImpactColor(directory.impact)}`}>
                    {directory.impact}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 mt-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 text-sm">DA: {directory.da}</span>
                  </div>
                  
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getFollowStatusStyle(directory.followStatus)}`}>
                    {directory.followStatus}
                  </span>
                </div>
              </div>
              
              <a
                href={directory.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-t border-gray-200 p-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span>View Directory</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* "Show More" or "Show Less" Button */}
        {filteredDirectories.length > initialDisplayCount && (
          <div className="flex justify-center mb-12">
            <Button
              variant="outline"
              className="flex items-center text-purple hover:bg-purple/5"
              onClick={() => setShowAllDirectories(!showAllDirectories)}
            >
              {showAllDirectories ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  <span>Show {filteredDirectories.length - initialDisplayCount} More Directories</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-purple/5 rounded-xl p-8 border border-purple/20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Save Hours of Manual Work
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            BacklinkBot's full database contains 1500+ carefully curated directories, with more filters and sorting options. You can submit your website, backlinkbot helps you analyze the best directories for your website.
          </p>
          <Button 
            className="bg-gradient-to-r from-purple to-purple-dark text-white hover:opacity-90 px-8 py-3 rounded-md shadow-md shadow-purple/20"
            // onClick={() => window.open('https://app.backlinkbot.ai')}
            onClick={() => scrollToSection('pricing')}
          >
            Access full database
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            Showing {displayedDirectories.length} of {filteredDirectories.length} matching directories. 
            <br />Submitting to these directories manually would take 30+ hours. 
            <br />BacklinkBot automates the process and gets it done in minutes for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDirectories;
