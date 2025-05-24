import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Tag, Book } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import ScrollToTopButton from '@/components/ScrollToTopButton';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  author: string;
  tags: string[];
  thumbnail?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts from the content/blog directory
        const response = await fetch('/content/blog/index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        
        // Transform the data into the expected format
        const transformedPosts = data.map((post: any) => ({
          id: post.slug || post.title.toLowerCase().replace(/\s+/g, '-'),
          title: post.title,
          date: post.date,
          summary: post.summary,
          author: post.author || 'Backlink Bot Team',
          tags: post.tags || ['SEO'],
          thumbnail: post.thumbnail
        })) as BlogPost[];
        
        setPosts(transformedPosts);
        setFilteredPosts(transformedPosts);
        
        // Extract all unique tags
        const tags = Array.from(new Set(transformedPosts.flatMap(post => post.tags))) as string[];
        setAllTags(tags);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query and selected tag
  useEffect(() => {
    let filtered = [...posts];
    
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(post => 
        post.tags.includes(selectedTag)
      );
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, selectedTag, posts]);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white pt-20">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Backlink Bot Blog</h1>
            <Link to="/glossary">
              <Button variant="outline" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                SEO Glossary
              </Button>
            </Link>
          </div>
          
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" onClick={() => setSelectedTag(null)}>
                  All Posts
                </TabsTrigger>
                {allTags.slice(0, 5).map((tag) => (
                  <TabsTrigger
                    key={tag}
                    value={tag}
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {selectedTag && (
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500 mr-2">Filtered by:</span>
                <div className="inline-flex items-center bg-purple-100 px-3 py-1 rounded-full text-purple-800 text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {selectedTag}
                  <button
                    className="ml-2 text-purple-600"
                    onClick={() => setSelectedTag(null)}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  date={post.date}
                  summary={post.summary}
                  // author={post.author}
                  tags={post.tags}
                  thumbnail={post.thumbnail}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Separator />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Blog;
