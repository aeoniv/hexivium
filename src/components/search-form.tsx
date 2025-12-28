'use client';

import { useTransition, useRef } from 'react';
import { handleSearch } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onSearch: (query: string, results: string[]) => void;
  onSearching: (isSearching: boolean) => void;
}

export function SearchForm({ onSearch, onSearching }: SearchFormProps) {
  const [isSearching, startSearchTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const clientAction = async (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query) {
      toast({
        title: 'Search Error',
        description: 'Please enter a search query.',
        variant: 'destructive',
      });
      return;
    }

    onSearching(true);
    
    startSearchTransition(async () => {
      const { results, error } = await handleSearch(query);
      if (error) {
        toast({
          title: 'Search Failed',
          description: error,
          variant: 'destructive',
        });
      } else {
        onSearch(query, results);
      }
      onSearching(false);
    });
  };

  return (
    <form ref={formRef} action={clientAction} className="flex w-full items-center gap-2 p-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          name="query"
          placeholder="Search with AI..."
          className="pl-10"
          disabled={isSearching}
        />
      </div>
      <Button type="submit" size="default" disabled={isSearching}>
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching
          </>
        ) : (
          'Search'
        )}
      </Button>
    </form>
  );
}
