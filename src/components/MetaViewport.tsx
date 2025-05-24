import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define types for SEO metadata
type MetaTagsProps = {
  title?: string;
  description?: string;
  keywords?: string;
  imageUrl?: string;
  type?: string;
};

// Page-specific metadata mapping
const pageMetadata: Record<string, MetaTagsProps> = {
  '/': {
    title: 'BacklinkBot AI - 100 Backlinks for your SAAS Startup',
    description: 'Submit your Startup to 100+ directories with Backlink Bot | Start getting instant Traffic to your Site | Build Backlinks, Increase your Google Search Rankings',
    keywords: 'backlinks, SEO tools, directory submission, SAAS startup, backlink building, Google rankings, SEO optimization, website traffic',
    type: 'website'
  },
  '/blog': {
    title: 'Backlink & SEO Blog - BacklinkBot AI',
    description: 'Latest articles, tips and strategies on building backlinks, improving SEO, and growing your startup through effective digital marketing.',
    keywords: 'SEO blog, backlink strategies, digital marketing tips, startup growth, SEO optimization',
    type: 'blog'
  },
  '/glossary': {
    title: 'SEO & Backlink Glossary - BacklinkBot AI',
    description: 'Comprehensive glossary of SEO and backlink terminology to help you understand and implement effective digital marketing strategies.',
    keywords: 'SEO glossary, backlink terms, digital marketing glossary, SEO definitions, backlink strategies',
    type: 'article'
  },
  '/tools': {
    title: 'Free SEO & Marketing Tools - BacklinkBot AI',
    description: 'Free tools for SEO, marketing, and backlink building to help your startup grow online and improve search rankings.',
    keywords: 'free SEO tools, marketing tools, backlink tools, SEO analysis, digital marketing utilities',
    type: 'website'
  },
  '/contact': {
    title: 'Contact Us - BacklinkBot AI',
    description: 'Get in touch with the BacklinkBot AI team for questions, partnerships, or support with our backlink and SEO tools.',
    keywords: 'contact, support, help, backlink services, SEO assistance',
    type: 'website'
  },
  '/affiliate': {
    title: 'Affiliate Program - BacklinkBot AI',
    description: 'Join our affiliate program and earn commissions by promoting our backlink and SEO tools to your audience.',
    keywords: 'affiliate program, earn commission, backlink tools affiliate, SEO affiliate',
    type: 'website'
  },
  '/submit-directory': {
    title: 'Submit Directory - BacklinkBot AI',
    description: 'Submit a new directory to our database to help startups find more places to build quality backlinks.',
    keywords: 'submit directory, add listing, backlink sources, startup directories',
    type: 'website'
  }
};

const MetaViewport = () => {
  const location = useLocation();
  const path = location.pathname;
  
  useEffect(() => {
    // Add basic meta tags for mobile optimization
    const addBasicMetaTags = () => {
      // Viewport meta tag
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      
      // Theme color meta tag
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', '#6B46C1');
      
      // Apple mobile web app capable meta tag
      let appleMobileWebAppCapableMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      if (!appleMobileWebAppCapableMeta) {
        appleMobileWebAppCapableMeta = document.createElement('meta');
        appleMobileWebAppCapableMeta.setAttribute('name', 'apple-mobile-web-app-capable');
        document.head.appendChild(appleMobileWebAppCapableMeta);
      }
      appleMobileWebAppCapableMeta.setAttribute('content', 'yes');
      
      // Apple mobile web app status bar style meta tag
      let appleMobileWebAppStatusBarStyleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!appleMobileWebAppStatusBarStyleMeta) {
        appleMobileWebAppStatusBarStyleMeta = document.createElement('meta');
        appleMobileWebAppStatusBarStyleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(appleMobileWebAppStatusBarStyleMeta);
      }
      appleMobileWebAppStatusBarStyleMeta.setAttribute('content', 'black-translucent');
      
      // Format detection meta tag
      let formatDetectionMeta = document.querySelector('meta[name="format-detection"]');
      if (!formatDetectionMeta) {
        formatDetectionMeta = document.createElement('meta');
        formatDetectionMeta.setAttribute('name', 'format-detection');
        document.head.appendChild(formatDetectionMeta);
      }
      formatDetectionMeta.setAttribute('content', 'telephone=no');
    };
    
    // Update SEO meta tags based on current page
    const updateSeoMetaTags = () => {
      // Get metadata for current page, or fallback to home page data
      const metadata = pageMetadata[path] || pageMetadata['/'];
      
      // Base URL for absolute URLs
      const baseUrl = 'https://backlinkbot.ai';
      
      // Update title
      document.title = metadata.title || 'BacklinkBot AI - Backlinks & SEO Tools';
      
      // Update description
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement('meta');
        descriptionMeta.setAttribute('name', 'description');
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.setAttribute('content', metadata.description || '');
      
      // Update keywords
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', metadata.keywords || '');
      
      // Update canonical
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', `${baseUrl}${path}`);
      
      // Update Open Graph tags
      const ogTags = [
        { property: 'og:title', content: metadata.title },
        { property: 'og:description', content: metadata.description },
        { property: 'og:url', content: `${baseUrl}${path}` },
        { property: 'og:type', content: metadata.type || 'website' },
        { property: 'og:image', content: `${baseUrl}${metadata.imageUrl || '/og-image.png'}` }
      ];
      
      ogTags.forEach(({ property, content }) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content || '');
      });
      
      // Update Twitter Card tags
      const twitterTags = [
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:title', content: metadata.title },
        { property: 'twitter:description', content: metadata.description },
        { property: 'twitter:url', content: `${baseUrl}${path}` },
        { property: 'twitter:image', content: `${baseUrl}${metadata.imageUrl || '/og-image.png'}` }
      ];
      
      twitterTags.forEach(({ property, content }) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content || '');
      });
    };
    
    addBasicMetaTags();
    updateSeoMetaTags();
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      // Force reflow after orientation change to fix iOS issues
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        
        // Reset after a short delay
        setTimeout(() => {
          viewportMeta.setAttribute('content', 
            'width=device-width, initial-scale=1.0');
        }, 300);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [path]); // Re-run when the path changes

  // This component doesn't render anything
  return null;
};

export default MetaViewport; 