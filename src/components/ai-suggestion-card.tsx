'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { biohackSuggestion } from '@/ai/flows/biohack-suggestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AISuggestionCardProps {
  hexagramDescription: string;
}

export function AISuggestionCard({ hexagramDescription }: AISuggestionCardProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await biohackSuggestion({ hexagramDescription });
      setSuggestion(result.suggestion);
    } catch (e) {
      setError('Failed to generate suggestion. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-background/50 mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>AI Biohack Suggestion</span>
          <Button size="sm" onClick={getSuggestion} disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {suggestion && <p className="text-foreground/90">{suggestion}</p>}
        {!isLoading && !suggestion && !error && (
          <p className="text-muted-foreground">Click "Generate" to get a personalized suggestion for today's energy.</p>
        )}
      </CardContent>
    </Card>
  );
}
