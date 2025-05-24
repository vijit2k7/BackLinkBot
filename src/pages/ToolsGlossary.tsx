import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlossaryItem from '@/components/GlossaryItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tool {
  id: string;
  name: string;
  description: string;
  website: string;
  features?: string[];
  category: string;
  pricing?: string;
  content?: string;
  tags?: string[];
}

const ToolsGlossary = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch tools data
  useEffect(() => {
    const fetchTools = async () => {
      try {
        // In a real implementation, this would fetch from your CMS
        // For now, we'll use mock data
        const mockTools: Tool[] = [
          // SEO Tools
          {
            id: 'ahrefs',
            name: 'Ahrefs',
            description: 'Comprehensive SEO toolset for backlink analysis, keyword research, competitor analysis, and more.',
            website: 'https://ahrefs.com',
            category: 'SEO',
            pricing: 'Paid with trial',
            features: ['Backlink Analysis', 'Keyword Research', 'Competitor Analysis', 'Rank Tracking', 'Site Audit'],
            tags: ['SEO', 'Backlinks', 'Keyword Research'],
            content: `
              Ahrefs is one of the most popular SEO tools available today. It offers a wide range of features designed to help you improve your website's search engine rankings.
              
              Key features include:
              
              - Backlink Checker: Analyze your backlink profile or your competitors'
              - Site Explorer: Comprehensive analysis of any website's performance
              - Keyword Explorer: Find keyword opportunities with accurate search volume data
              - Rank Tracker: Monitor your rankings for target keywords
              - Content Explorer: Discover top-performing content in your niche
              - Site Audit: Identify and fix technical SEO issues
              
              Ahrefs is particularly noted for its backlink database, which is one of the largest and most accurate in the industry.
            `
          },
          {
            id: 'semrush',
            name: 'SEMrush',
            description: 'All-in-one marketing toolkit for SEO, content marketing, competitor research, and PPC.',
            website: 'https://www.semrush.com',
            category: 'SEO',
            pricing: 'Paid with trial',
            features: ['Keyword Research', 'Competitor Analysis', 'Site Audit', 'Rank Tracking', 'Backlink Analysis'],
            tags: ['SEO', 'PPC', 'Content Marketing'],
            content: `
              SEMrush is a comprehensive marketing platform that offers a wide range of tools for improving online visibility and discovering marketing insights.
              
              Its main features include:
              
              - Keyword Magic Tool: Find millions of keyword ideas with metrics
              - Domain Overview: Analyze any domain's overall online performance
              - Position Tracking: Monitor your rankings across various locations
              - Site Audit: Check for over 130 technical and SEO issues
              - Backlink Audit & Analytics: Analyze backlink profiles and find toxic links
              - Content Marketing Platform: Data-driven recommendations for content creation
              
              SEMrush is particularly valuable for its competitive intelligence features, allowing you to understand and outperform your competitors.
            `
          },
          {
            id: 'moz',
            name: 'Moz Pro',
            description: 'SEO software that helps with rank tracking, site audits, and link building campaigns.',
            website: 'https://moz.com',
            category: 'SEO',
            pricing: 'Paid with trial',
            features: ['Rank Tracking', 'Site Audit', 'Link Research', 'Keyword Research'],
            tags: ['SEO', 'Link Building'],
            content: `
              Moz Pro is a popular SEO software suite that provides tools for improving search engine rankings, increasing traffic, and growing brand awareness.
              
              Key features include:
              
              - Keyword Explorer: Find keyword opportunities with accurate metrics
              - Rank Tracker: Monitor your rankings for important keywords
              - Site Crawl: Identify and fix technical SEO issues
              - Link Explorer: Analyze and compare backlink profiles
              - On-Page Optimization: Get actionable recommendations for improving page content
              
              Moz is also known for creating the Domain Authority (DA) and Page Authority (PA) metrics, which are widely used in the SEO industry to gauge website quality.
            `
          },
          {
            id: 'screaming-frog',
            name: 'Screaming Frog SEO Spider',
            description: 'Website crawler that helps you improve onsite SEO by identifying issues and opportunities.',
            website: 'https://www.screamingfrog.co.uk/seo-spider/',
            category: 'SEO',
            pricing: 'Free version available, paid for full features',
            features: ['Site Crawling', 'Technical SEO Audit', 'Broken Link Checking', 'XML Sitemap Generation'],
            tags: ['SEO', 'Technical SEO', 'Site Audit'],
            content: `
              Screaming Frog SEO Spider is a desktop program that crawls websites to analyze and audit technical and onsite SEO issues.
              
              Key features include:
              
              - Find broken links, redirects, and errors
              - Analyze page titles and meta descriptions
              - Discover duplicate content
              - Extract data with custom search
              - Generate XML sitemaps
              - Analyze site architecture and link structure
              - Integrate with Google Analytics and Search Console
              
              The free version allows you to crawl up to 500 URLs, while the paid version removes this limitation and provides additional advanced features.
            `
          },
          
          // Backlink Tools
          {
            id: 'backlinkbot',
            name: 'BacklinkBot',
            description: 'AI-powered backlink building and outreach platform designed to automate and streamline your link building efforts.',
            website: 'https://www.backlinkbot.com',
            category: 'Backlink Building',
            pricing: 'Paid with trial',
            features: ['Automated Outreach', 'AI Content Generation', 'Campaign Management', 'Link Tracking'],
            tags: ['Backlinks', 'Outreach', 'AI'],
            content: `
              BacklinkBot is an innovative platform that uses AI to streamline the entire backlink acquisition process.
              
              Key features include:
              
              - Automated prospecting and outreach
              - AI-generated personalized emails
              - Advanced campaign management
              - Detailed performance analytics
              - Integration with major SEO tools
              
              BacklinkBot is designed to make link building more efficient and effective by automating repetitive tasks while maintaining personalization.
            `
          },
          {
            id: 'pitchbox',
            name: 'Pitchbox',
            description: 'Outreach platform for link building, content promotion, and PR campaigns.',
            website: 'https://pitchbox.com',
            category: 'Backlink Building',
            pricing: 'Paid',
            features: ['Influencer Outreach', 'Email Automation', 'CRM', 'Reporting'],
            tags: ['Backlinks', 'Outreach', 'Content Promotion'],
            content: `
              Pitchbox is an outreach and link building platform designed to help scale your outreach campaigns while maintaining personalization.
              
              Key features include:
              
              - Prospecting and outreach workflow automation
              - Customizable email sequences and follow-ups
              - Relationship management tools
              - Detailed reporting and analytics
              - Team collaboration features
              
              Pitchbox integrates with major SEO tools like Moz, Majestic, and SEMrush to provide additional data for your outreach campaigns.
            `
          },
          {
            id: 'hunter',
            name: 'Hunter.io',
            description: 'Email finding and verification tool for outreach campaigns.',
            website: 'https://hunter.io',
            category: 'Backlink Building',
            pricing: 'Free plan available, paid for more features',
            features: ['Email Finder', 'Email Verifier', 'Outreach Campaigns'],
            tags: ['Email Outreach', 'Lead Generation'],
            content: `
              Hunter.io helps you find and verify professional email addresses for your outreach campaigns.
              
              Key features include:
              
              - Domain Search: Find email addresses associated with any website
              - Email Finder: Discover specific email addresses when you know a person's name and company
              - Email Verifier: Check if email addresses are valid and deliverable
              - Campaigns: Send personalized cold emails directly from the platform
              - Chrome Extension: Find email addresses while browsing LinkedIn or company websites
              
              Hunter.io offers a free plan allowing 25 searches per month, with paid plans for more extensive usage.
            `
          },
          
          // Content Marketing Tools
          {
            id: 'surfer-seo',
            name: 'Surfer SEO',
            description: 'Content optimization tool that helps you create SEO-friendly content based on data-driven insights.',
            website: 'https://surferseo.com',
            category: 'Content Marketing',
            pricing: 'Paid with trial',
            features: ['Content Editor', 'SERP Analyzer', 'Keyword Research', 'Content Planner'],
            tags: ['Content Optimization', 'SEO', 'Content Creation'],
            content: `
              Surfer SEO is a data-driven SEO tool that helps you optimize content and improve rankings through AI-powered content analysis.
              
              Key features include:
              
              - Content Editor: Real-time guidelines for creating optimized content
              - SERP Analyzer: Analyze the top-ranking pages for your keywords
              - Content Planner: Generate content strategies based on keyword clusters
              - Audit: Compare your page against top-ranking competitors
              - Grow Flow: Weekly actionable SEO tasks and suggestions
              
              Surfer SEO stands out for its ability to analyze on-page factors and provide specific recommendations for content optimization.
            `
          },
          {
            id: 'clearscope',
            name: 'Clearscope',
            description: 'Content optimization platform that helps you create relevant content for search engines.',
            website: 'https://www.clearscope.io',
            category: 'Content Marketing',
            pricing: 'Paid',
            features: ['Content Optimization', 'Content Briefs', 'Content Inventory'],
            tags: ['Content Optimization', 'SEO'],
            content: `
              Clearscope is a content optimization platform that helps you create content that performs well in search engines by analyzing what's already ranking.
              
              Key features include:
              
              - Content Optimization: Get recommendations for improving existing content
              - Content Briefs: Create comprehensive briefs for writers
              - Content Inventory: Analyze your entire content library
              - Competition Analysis: See how you stack up against the competition
              - Google Docs Integration: Optimize content directly in Google Docs
              
              Clearscope uses AI to analyze the top-ranking content for your target keywords and provides recommendations to help your content compete effectively.
            `
          },
          {
            id: 'grammarly',
            name: 'Grammarly',
            description: 'Writing assistant that checks grammar, spelling, and style to help you create error-free content.',
            website: 'https://www.grammarly.com',
            category: 'Content Marketing',
            pricing: 'Free version available, paid for premium features',
            features: ['Grammar Checking', 'Spell Checking', 'Style Suggestions', 'Plagiarism Detection'],
            tags: ['Content Creation', 'Writing'],
            content: `
              Grammarly is an AI-powered writing assistant that helps you create clear, error-free, and effective content.
              
              Key features include:
              
              - Grammar and spelling correction
              - Style and tone adjustments
              - Clarity and conciseness suggestions
              - Plagiarism detection (Premium)
              - Browser extension and desktop app
              - Integration with major writing platforms
              
              Grammarly helps ensure your content is professional and polished, which is essential for building credibility with your audience.
            `
          },
          
          // Analytics Tools
          {
            id: 'google-analytics',
            name: 'Google Analytics',
            description: 'Web analytics service that tracks and reports website traffic and user behavior.',
            website: 'https://analytics.google.com',
            category: 'Analytics',
            pricing: 'Free (GA4), paid for enterprise (GA360)',
            features: ['Traffic Analysis', 'User Behavior', 'Conversion Tracking', 'Custom Reports'],
            tags: ['Analytics', 'User Behavior', 'Conversion Tracking'],
            content: `
              Google Analytics is the most widely used web analytics service, providing detailed statistics about website traffic and user behavior.
              
              Key features include:
              
              - Real-time tracking of website visitors
              - User behavior analysis (pageviews, time on site, bounce rate)
              - Audience demographics and interests
              - Conversion tracking and goal setting
              - Campaign performance measurement
              - Custom reports and dashboards
              
              Google Analytics 4 (GA4) is the latest version, focusing on event-based data and providing more advanced machine learning insights.
            `
          },
          {
            id: 'hotjar',
            name: 'Hotjar',
            description: 'Behavior analytics tool that reveals how users interact with your website through heatmaps and recordings.',
            website: 'https://www.hotjar.com',
            category: 'Analytics',
            pricing: 'Free plan available, paid for more features',
            features: ['Heatmaps', 'Session Recordings', 'Feedback Polls', 'Surveys'],
            tags: ['User Behavior', 'UX', 'Conversion Optimization'],
            content: `
              Hotjar is a powerful tool that combines analytics and feedback tools to help you understand how users interact with your website.
              
              Key features include:
              
              - Heatmaps: Visualize where users click, move, and scroll
              - Session Recordings: Watch recordings of actual user sessions
              - Conversion Funnels: Identify where users drop off
              - Feedback Polls: Collect user feedback directly on your site
              - Surveys: Create and distribute surveys to understand user needs
              
              Hotjar helps bridge the gap between quantitative analytics (what users do) and qualitative insights (why they do it).
            `
          },
          
          // Social Media Tools
          {
            id: 'buffer',
            name: 'Buffer',
            description: 'Social media management platform for scheduling posts, analyzing performance, and managing all your accounts in one place.',
            website: 'https://buffer.com',
            category: 'Social Media',
            pricing: 'Free plan available, paid for more features',
            features: ['Post Scheduling', 'Analytics', 'Team Collaboration', 'Multi-Account Management'],
            tags: ['Social Media', 'Content Scheduling', 'Analytics'],
            content: `
              Buffer is a user-friendly social media management platform that helps you schedule content, analyze performance, and manage multiple accounts.
              
              Key features include:
              
              - Content scheduling across multiple platforms
              - Visual planning with a content calendar
              - Performance analytics and reporting
              - Team collaboration tools
              - Browser extension for quick sharing
              
              Buffer supports all major social media platforms including Facebook, Instagram, Twitter, LinkedIn, and Pinterest.
            `
          },
          {
            id: 'hootsuite',
            name: 'Hootsuite',
            description: 'Social media management platform with advanced features for team collaboration and content planning.',
            website: 'https://hootsuite.com',
            category: 'Social Media',
            pricing: 'Paid with trial',
            features: ['Post Scheduling', 'Social Monitoring', 'Team Collaboration', 'Analytics'],
            tags: ['Social Media', 'Content Scheduling', 'Team Collaboration'],
            content: `
              Hootsuite is a comprehensive social media management platform designed for businesses of all sizes.
              
              Key features include:
              
              - Content scheduling and publishing
              - Social media monitoring and listening
              - Team workflow and approval processes
              - Comprehensive analytics and reporting
              - Ad campaign management
              - Integration with over 150 apps
              
              Hootsuite is particularly valuable for larger teams and enterprises that need robust collaboration features and detailed reporting.
            `
          },
          
          // Email Marketing Tools
          {
            id: 'mailchimp',
            name: 'Mailchimp',
            description: 'Email marketing platform with automation, landing pages, and CRM features for small businesses.',
            website: 'https://mailchimp.com',
            category: 'Email Marketing',
            pricing: 'Free plan available, paid for more features',
            features: ['Email Campaigns', 'Automation', 'Landing Pages', 'CRM', 'Analytics'],
            tags: ['Email Marketing', 'Automation', 'CRM'],
            content: `
              Mailchimp has evolved from an email marketing service to an all-in-one marketing platform for small businesses.
              
              Key features include:
              
              - Email campaign creation with drag-and-drop editor
              - Marketing automation and customer journeys
              - Landing page and form builders
              - Customer relationship management (CRM)
              - Audience segmentation and targeting
              - Comprehensive analytics and reporting
              
              Mailchimp offers a free plan for up to 2,000 contacts, making it accessible for startups and small businesses.
            `
          },
          {
            id: 'convertkit',
            name: 'ConvertKit',
            description: 'Email marketing platform designed specifically for creators and online businesses.',
            website: 'https://convertkit.com',
            category: 'Email Marketing',
            pricing: 'Free plan available, paid for more features',
            features: ['Email Sequences', 'Visual Automation', 'Landing Pages', 'Forms'],
            tags: ['Email Marketing', 'Creators', 'Automation'],
            content: `
              ConvertKit is an email marketing platform specifically designed for creators, bloggers, and online businesses.
              
              Key features include:
              
              - Subscriber tagging and segmentation
              - Visual automation builder
              - Customizable opt-in forms
              - Landing page builder
              - Email sequence creation
              - Commerce features for selling digital products
              
              ConvertKit stands out for its focus on creators and its intuitive interface for building automated email sequences.
            `
          },
          
          // Productivity Tools
          {
            id: 'notion',
            name: 'Notion',
            description: 'All-in-one workspace for notes, tasks, wikis, and databases that helps teams collaborate effectively.',
            website: 'https://www.notion.so',
            category: 'Productivity',
            pricing: 'Free plan available, paid for more features',
            features: ['Note Taking', 'Project Management', 'Knowledge Base', 'Database Management'],
            tags: ['Productivity', 'Team Collaboration', 'Knowledge Management'],
            content: `
              Notion is a versatile workspace that combines notes, tasks, wikis, and databases in one platform.
              
              Key features include:
              
              - Customizable pages and databases
              - Task and project management
              - Team wiki and knowledge base
              - Document collaboration
              - Integration with other tools
              - Templates for various use cases
              
              Notion's flexibility allows it to replace multiple tools like Evernote, Trello, and Confluence, streamlining your workflow.
            `
          },
          {
            id: 'zapier',
            name: 'Zapier',
            description: 'Automation tool that connects your apps and services to automate repetitive tasks without coding.',
            website: 'https://zapier.com',
            category: 'Productivity',
            pricing: 'Free plan available, paid for more features',
            features: ['App Integration', 'Workflow Automation', 'Task Scheduling', 'Custom Logic'],
            tags: ['Automation', 'Integration', 'Workflow'],
            content: `
              Zapier is an automation platform that connects over 3,000 apps and services to help you automate repetitive tasks.
              
              Key features include:
              
              - Zaps: Automated workflows between apps
              - Multi-step Zaps: Complex workflows with multiple steps
              - Filters: Conditional logic to control when actions occur
              - Paths: Different actions based on conditions
              - Formatter: Transform data between apps
              
              Zapier helps save time and reduce manual work by automating tasks like lead generation, data entry, file management, and more.
            `
          },
          
          // Website Tools
          {
            id: 'wordpress',
            name: 'WordPress',
            description: 'The most popular content management system (CMS) for building websites and blogs.',
            website: 'https://wordpress.org',
            category: 'Website',
            pricing: 'Free (self-hosted), hosting costs apply',
            features: ['Content Management', 'Plugin Ecosystem', 'Themes', 'Customization'],
            tags: ['CMS', 'Blogging', 'Website Building'],
            content: `
              WordPress powers over 40% of all websites on the internet, making it the most popular content management system.
              
              Key features include:
              
              - User-friendly content management
              - Thousands of themes for customization
              - Extensive plugin ecosystem (over 58,000 plugins)
              - SEO-friendly structure
              - Regular updates and security patches
              - Scalability from small blogs to enterprise sites
              
              WordPress is highly flexible and can be used for blogs, business websites, e-commerce stores, membership sites, and more.
            `
          },
          {
            id: 'webflow',
            name: 'Webflow',
            description: 'Visual web design tool that allows you to build professional, custom websites without coding.',
            website: 'https://webflow.com',
            category: 'Website',
            pricing: 'Free plan available, paid for more features',
            features: ['Visual Design', 'CMS', 'E-commerce', 'Hosting'],
            tags: ['Web Design', 'No-Code', 'CMS'],
            content: `
              Webflow is a visual web design platform that combines design freedom with the convenience of a content management system.
              
              Key features include:
              
              - Visual design interface with precise control
              - Built-in CMS for dynamic content
              - E-commerce functionality
              - Responsive design tools
              - Hosting and SSL certificates
              - Export clean, semantic code
              
              Webflow bridges the gap between design tools like Figma and development platforms, allowing designers to create production-ready websites without coding.
            `
          },
          
          // AI Tools
          {
            id: 'chatgpt',
            name: 'ChatGPT',
            description: 'AI-powered conversational assistant that can help with content creation, research, and problem-solving.',
            website: 'https://chat.openai.com',
            category: 'AI',
            pricing: 'Free version available, paid for premium features',
            features: ['Content Generation', 'Research Assistance', 'Code Help', 'Language Translation'],
            tags: ['AI', 'Content Creation', 'Productivity'],
            content: `
              ChatGPT is an AI language model developed by OpenAI that can understand and generate human-like text based on the prompts you give it.
              
              Key use cases include:
              
              - Content creation and ideation
              - Drafting emails and messages
              - Research assistance
              - Code writing and debugging
              - Language translation
              - Creative writing
              
              The free version provides access to GPT-3.5, while ChatGPT Plus subscribers get access to GPT-4, which offers enhanced capabilities and faster response times.
            `
          },
          {
            id: 'jasper',
            name: 'Jasper',
            description: 'AI content creation platform specifically designed for marketing teams and content creators.',
            website: 'https://www.jasper.ai',
            category: 'AI',
            pricing: 'Paid with trial',
            features: ['Content Generation', 'Templates', 'Brand Voice', 'Collaboration'],
            tags: ['AI', 'Content Creation', 'Marketing'],
            content: `
              Jasper (formerly Jarvis) is an AI content creation platform designed specifically for marketing teams and content creators.
              
              Key features include:
              
              - AI content generation for various formats
              - 50+ templates for different content types
              - Brand voice customization
              - Team collaboration tools
              - SEO optimization with Surfer SEO integration
              - Chrome extension for writing anywhere
              
              Jasper is trained on marketing and copywriting principles, making it particularly effective for creating marketing content like ads, emails, blog posts, and social media content.
            `
          }
        ];

        setTools(mockTools);
        setFilteredTools(mockTools);

        // Extract unique categories
        const uniqueCategories = [...new Set(mockTools.map(tool => tool.category))];
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tools:", error);
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Filter tools based on search query and selected category
  useEffect(() => {
    if (tools.length === 0) return;

    let filtered = [...tools];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tool => 
          tool.name.toLowerCase().includes(query) || 
          tool.description.toLowerCase().includes(query) ||
          tool.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          tool.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory, tools]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card className="mb-6 overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{tool.name}</CardTitle>
            <CardDescription className="text-gray-600 mt-1">{tool.description}</CardDescription>
          </div>
          <a 
            href={tool.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
          >
            Visit <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-3">
          <Badge variant="outline" className="mr-2 mb-2">{tool.category}</Badge>
          {tool.pricing && (
            <Badge variant="secondary" className="mr-2 mb-2">{tool.pricing}</Badge>
          )}
          {tool.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="mr-2 mb-2 bg-gray-100">{tag}</Badge>
          ))}
        </div>
        
        {tool.features && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-1">Key Features:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {tool.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        {tool.content && (
          <div 
            className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md"
            dangerouslySetInnerHTML={{ __html: tool.content }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white pt-20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Link to="/" className="text-purple-600 hover:text-purple-800 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">
            <span className="text-purple-600">Startup Toolkit</span>: Essential Tools for Business Growth
          </h1>
          <p className="text-gray-600 text-lg">
            A curated collection of the best tools to help early-stage startups and businesses grow their online presence, improve SEO, build backlinks, and boost productivity.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for tools, categories, or features..."
              className="pl-10 py-6"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 flex flex-wrap h-auto">
              <TabsTrigger 
                value="all" 
                onClick={() => handleCategorySelect('all')}
                className="mr-2 mb-2"
              >
                All Tools
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => handleCategorySelect(category)}
                  className="mr-2 mb-2"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Tool Listings */}
        <div className="mb-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading tools...</p>
            </div>
          ) : filteredTools.length > 0 ? (
            filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No tools found matching your search criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolsGlossary; 