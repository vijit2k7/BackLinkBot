
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Tag, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  id: string;
  title: string;
  date: string;
  summary: string;
  author: string;
  tags: string[];
  thumbnail?: string;
}

const BlogCard = ({ id, title, date, summary, author, tags, thumbnail }: BlogCardProps) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
      {thumbnail && (
        <div className="h-48 overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <CardTitle className="text-xl hover:text-purple-600 transition-colors">
          <Link to={`/blog/${id}`}>{title}</Link>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>{author}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <CardDescription className="text-gray-600">
          {summary}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start gap-3 pt-0">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/blog/${id}`}>
          <Button variant="outline" size="sm" className="mt-2 text-purple-600 border-purple-600 hover:bg-purple-50">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
