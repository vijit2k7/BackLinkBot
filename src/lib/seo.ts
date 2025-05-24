/**
 * SEO utilities for the BacklinkBot website
 * Provides functions to dynamically generate meta descriptions and titles for tools and blog posts
 */

type SeoMetadata = {
  title: string;
  description: string;
  keywords: string;
  imageUrl?: string;
  type?: string;
};

/**
 * Generates SEO metadata for tool pages
 * @param toolName The name of the tool
 * @param description Short description of the tool
 * @returns SeoMetadata object with title, description, and keywords
 */
export const generateToolMetadata = (toolName: string, description: string): SeoMetadata => {
  const title = `${toolName} | Free SEO Tool - BacklinkBot AI`;
  const fullDescription = `${description} Free online tool by BacklinkBot AI to help boost your SEO and marketing efforts.`;
  const keywords = `${toolName.toLowerCase()}, free SEO tool, marketing tool, ${toolName.toLowerCase()} generator, online ${toolName.toLowerCase()}, SEO optimization, digital marketing`;
  
  return {
    title,
    description: fullDescription,
    keywords,
    type: 'website'
  };
};

/**
 * Generates SEO metadata for blog posts
 * @param postTitle The title of the blog post
 * @param excerpt Short excerpt or summary of the post
 * @param category The category of the post (e.g., SEO, Backlinks)
 * @param imageUrl Optional image URL for the post
 * @returns SeoMetadata object with title, description, keywords and image URL
 */
export const generateBlogMetadata = (
  postTitle: string, 
  excerpt: string, 
  category: string, 
  imageUrl?: string
): SeoMetadata => {
  const title = `${postTitle} - BacklinkBot AI Blog`;
  const keywords = `${category.toLowerCase()}, ${postTitle.toLowerCase().replace(/[^\w\s]/gi, '').split(' ').join(', ')}, backlinks, SEO, digital marketing, startup growth`;
  
  return {
    title,
    description: excerpt,
    keywords,
    imageUrl,
    type: 'article'
  };
};

/**
 * Generates structured data for blog posts (JSON-LD)
 * @param postTitle The title of the blog post
 * @param excerpt Short excerpt or summary of the post
 * @param date Publication date in ISO format
 * @param authorName Name of the author
 * @param imageUrl URL of the post image
 * @param url Full URL of the blog post
 * @returns JSON-LD script content as a string
 */
export const generateBlogJsonLd = (
  postTitle: string,
  excerpt: string,
  date: string,
  authorName: string,
  imageUrl: string,
  url: string
): string => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': postTitle,
    'description': excerpt,
    'image': imageUrl,
    'datePublished': date,
    'author': {
      '@type': 'Person',
      'name': authorName
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'BacklinkBot AI',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://backlinkbot.ai/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url
    }
  };
  
  return JSON.stringify(jsonLd);
};

/**
 * Generates structured data for tools (JSON-LD)
 * @param toolName The name of the tool
 * @param description Short description of the tool
 * @param url Full URL of the tool page
 * @returns JSON-LD script content as a string
 */
export const generateToolJsonLd = (
  toolName: string,
  description: string,
  url: string
): string => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': toolName,
    'description': description,
    'applicationCategory': 'WebApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'provider': {
      '@type': 'Organization',
      'name': 'BacklinkBot AI',
      'url': 'https://backlinkbot.ai'
    },
    'url': url
  };
  
  return JSON.stringify(jsonLd);
}; 