import React, { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  tags: string[];
  thumbnail?: string;
}

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch the list of blog posts
        const response = await fetch('/content/blog/index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const posts = await response.json();
        
        // Sort posts by date
        const sortedPosts = posts.sort((a: BlogPost, b: BlogPost) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Filter out any posts with empty titles or invalid data
        const validPosts = sortedPosts.filter(post => 
          post.title && 
          post.date && 
          post.slug &&
          !post.tags.includes('""') && 
          !post.tags.includes("''")
        );
        
        setBlogPosts(validPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Latest from our Blog</h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Resources, tips and insights to help you boost your website's visibility and drive more traffic
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">{error}</h3>
                <p className="text-gray-500">Please try again later.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <div key={post.slug} className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                    {post.thumbnail && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.thumbnail} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {post.tags[0]}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(post.date)} • By {post.author}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.summary}</p>
                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="link" className="px-0 text-purple-600 hover:text-purple-800">
                          Read more →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blogs;
