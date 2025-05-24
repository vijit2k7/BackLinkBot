
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GlossaryItemProps {
  term: string;
  definition: string;
  content?: string;
}

const GlossaryItem = ({ term, definition, content }: GlossaryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{term}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-2">{definition}</p>
        
        {content && (
          <>
            {isExpanded ? (
              <div className="mt-4 text-gray-600">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            ) : null}
            
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-purple-600"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Learn More
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GlossaryItem;
