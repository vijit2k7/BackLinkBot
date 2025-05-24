import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SeoHead from '@/components/SeoHead';
import { generateBlogMetadata, generateBlogJsonLd } from '@/lib/seo';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface BlogPostData {
  title: string;
  date: string;
  author: string;
  content: string;
  tags: string[];
  thumbnail?: string;
  summary: string;
}

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching blog post:', postId);
        
        // First, fetch the index to get the post metadata
        const indexResponse = await fetch('/content/blog/index.json');
        if (!indexResponse.ok) {
          console.error('Failed to fetch index:', indexResponse.status, indexResponse.statusText);
          throw new Error('Failed to fetch blog index');
        }
        const posts = await indexResponse.json();
        console.log('Fetched posts:', posts);
        
        const postMeta = posts.find((p: any) => p.slug === postId);
        console.log('Found post metadata:', postMeta);
        
        if (!postMeta) {
          setError('Blog post not found');
          setIsLoading(false);
          return;
        }

        // Then fetch the actual markdown content
        const formattedDate = new Date(postMeta.date).toISOString().split('T')[0];
        const markdownPath = `/content/blog/${formattedDate}-${postId}.md`;
        console.log('Attempting to fetch markdown from:', markdownPath);
        
        const contentResponse = await fetch(markdownPath);
        let content;
        
        if (!contentResponse.ok) {
          console.error('Failed to fetch content:', contentResponse.status, contentResponse.statusText);
          // Try alternative path without date
          const altPath = `/content/blog/${postId}.md`;
          console.log('Trying alternative path:', altPath);
          const altResponse = await fetch(altPath);
          if (!altResponse.ok) {
            console.error('Failed to fetch from alternative path:', altResponse.status, altResponse.statusText);
            throw new Error(`Failed to fetch blog content: ${contentResponse.status} ${contentResponse.statusText}`);
          }
          content = await altResponse.text();
        } else {
          content = await contentResponse.text();
        }

        console.log('Fetched content:', content.substring(0, 100) + '...');
        
        if (!content.includes('---')) {
          throw new Error('Invalid blog post format: Missing frontmatter delimiters');
        }
        
        const contentParts = content.trim().split('---');
        if (contentParts.length < 3) {
          throw new Error('Invalid blog post format: Incorrect frontmatter structure');
        }
        
        // Parse the frontmatter YAML
        const frontmatter = contentParts[1];
        const postContent = contentParts.slice(2).join('---').trim();
        
        // Extract metadata from frontmatter
        const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);
        const dateMatch = frontmatter.match(/date:\s*(.+)/);
        const authorMatch = frontmatter.match(/author:\s*(.+)/);
        const thumbnailMatch = frontmatter.match(/thumbnail:\s*(.+)/);
        const summaryMatch = frontmatter.match(/summary:\s*(.+)/);
        const tagsMatch = frontmatter.match(/tags:\s*\n((\s*-\s*.+\n?)+)/);
        
        const tags = tagsMatch 
          ? tagsMatch[1]
              .split('\n')
              .filter(line => line.trim())
              .map(tag => tag.replace(/^\s*-\s*/, '').trim())
          : [];

        setPost({
          title: titleMatch ? titleMatch[1].trim() : '',
          date: dateMatch ? dateMatch[1].trim() : '',
          author: authorMatch ? authorMatch[1].trim() : 'Backlink Bot Team',
          content: postContent,
          tags: tags.filter(tag => tag !== '""' && tag !== "''"),
          thumbnail: thumbnailMatch ? thumbnailMatch[1].trim() : undefined,
          summary: summaryMatch ? summaryMatch[1].trim() : ''
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post');
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
    
    // Scroll to top when the blog post changes
    window.scrollTo(0, 0);
  }, [postId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => console.error('Could not copy text: ', err));
    }
  };

  // Generate SEO metadata for this blog post
  const metadata = post ? generateBlogMetadata(
    post.title,
    post.summary,
    post.tags[0],
    post.thumbnail || ''
  ) : null;
  
  // Generate structured data
  const structuredData = post ? generateBlogJsonLd(
    post.title,
    post.summary,
    post.date,
    post.author,
    post.thumbnail || '',
    window.location.href
  ) : null;

  return (
    <>
      {metadata && structuredData && (
        <SeoHead
          title={metadata.title}
          description={metadata.description}
          keywords={metadata.keywords}
          canonicalUrl={window.location.pathname}
          imageUrl={metadata.imageUrl}
          type="article"
          structuredData={structuredData}
        />
      )}
      
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 pt-20">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">{error}</h3>
                  <p className="text-gray-500 mb-4">The blog post you're looking for might have been removed or doesn't exist.</p>
                  <Link to="/blog">
                    <Button>Return to Blog</Button>
                  </Link>
                </div>
              ) : post ? (
                <article>
                  {post.thumbnail && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={post.thumbnail} 
                        alt={post.title} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={handleShare} className="ml-auto">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <Link key={index} to={`/blog?tag=${tag}`}>
                        <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700 hover:bg-gray-200 transition-colors">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="prose prose-purple max-w-none prose-lg prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-headings:mt-8 prose-headings:mb-4 prose-p:my-6 prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-blockquote:my-6 prose-blockquote:pl-4 prose-blockquote:border-l-4 prose-blockquote:border-purple-300 prose-blockquote:italic prose-blockquote:text-gray-700 prose-img:my-8 prose-img:rounded-lg prose-img:shadow-md">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeHighlight]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" />
                        ),
                        img: ({ node, ...props }) => (
                          <img {...props} className="rounded-lg shadow-md my-8" loading="lazy" />
                        ),
                        code: ({ inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return inline ? (
                            <code {...props} className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          ) : (
                            <code
                              {...props}
                              className={`${match ? `language-${match[1]}` : ''} block overflow-x-auto p-4 text-sm`}
                            >
                              {children}
                            </code>
                          );
                        },
                        pre: ({ node, ...props }) => (
                          <pre {...props} className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6" />
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 {...props} className="text-3xl font-bold mt-12 mb-6" />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 {...props} className="text-2xl font-bold mt-10 mb-5" />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 {...props} className="text-xl font-bold mt-8 mb-4" />
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className="my-6 leading-relaxed text-base" />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul {...props} className="list-disc list-outside pl-6 my-6 space-y-2" />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol {...props} className="list-decimal list-outside pl-6 my-6 space-y-2" />
                        ),
                        li: ({ node, ...props }) => (
                          <li {...props} className="my-2 text-base" />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote {...props} className="border-l-4 border-purple-300 pl-4 my-6 italic text-gray-700" />
                        ),
                        hr: ({ node, ...props }) => (
                          <hr {...props} className="my-8 border-t border-gray-200" />
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-8">
                            <table {...props} className="min-w-full divide-y divide-gray-200" />
                          </div>
                        ),
                        th: ({ node, ...props }) => (
                          <th {...props} className="px-4 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900" />
                        ),
                        td: ({ node, ...props }) => (
                          <td {...props} className="px-4 py-3 text-sm text-gray-700 border-t" />
                        )
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Call to Action Section */}
                  <div className="mt-12 mb-8 p-8 bg-purple-50 rounded-lg border border-purple-100 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Boost Your Website's Authority</h3>
                    <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                      Ready to supercharge your SEO with quality backlinks? Backlink Bot helps you build a stronger online presence and drive more traffic to your website especially if you new to SEO.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link to="/">
                        <Button size="lg" className="w-full sm:w-auto">
                          See How It Works
                        </Button>
                      </Link>
                      <Link to="/">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                          Submit your startup 
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ) : null}
            </div>
          </div>
        </main>
        
        <Separator />
        <Footer />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default BlogPost;
