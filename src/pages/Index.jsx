import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExternalLink, ThumbsUp, Search } from 'lucide-react';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Hacker News Top 100</h1>
      
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="max-w-4xl mx-auto grid gap-4">
          {[...Array(10)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <CardTitle className="h-6 bg-gray-300 rounded"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto text-center text-red-500">
          Error: {error.message}
        </div>
      )}

      {!isLoading && !error && (
        <div className="max-w-4xl mx-auto grid gap-4">
          {filteredStories.map((story) => (
            <Card key={story.objectID}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    <span>{story.points} points</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(story.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;