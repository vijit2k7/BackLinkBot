import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

type SeoHeadProps = {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'blog';
  structuredData?: string;
};

/**
 * Component to add SEO-related tags to the head of the document
 * Uses React Helmet for managing document head
 */
const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl = '/og-image.png',
  type = 'website',
  structuredData
}) => {
  const baseUrl = 'https://backlinkbot.ai';
  const fullUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  
  // Add JSON-LD structured data script
  useEffect(() => {
    if (structuredData) {
      // Remove any existing JSON-LD scripts
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());
      
      // Add new JSON-LD script
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = structuredData;
      document.head.appendChild(script);
      
      return () => {
        // Clean up when component unmounts
        script.remove();
      };
    }
  }, [structuredData]);
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      
      {/* Twitter Card */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

export default SeoHead; 