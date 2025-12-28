'use client';

import type { File } from '@/lib/repository';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, File as FileIcon } from 'lucide-react';

interface CodeViewProps {
  file: File | null;
  searchResults: { query: string; results: string[] } | null;
  isSearching: boolean;
}

const highlightSyntax = (code: string, language: File['language']): string => {
  let highlightedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (language === 'javascript' || language === 'python') {
    // Comments
    const commentRegex = language === 'javascript' ? /(\/\/.*)|(\/\*[\s\S]*?\*\/)/g : /(#.*)/g;
    highlightedCode = highlightedCode.replace(
      commentRegex,
      '<span class="text-muted-foreground/70">$&</span>'
    );

    // Strings
    highlightedCode = highlightedCode.replace(
      /(".*?")|('.*?')|(`[\s\S]*?`)/g,
      '<span class="text-accent/90">$&</span>'
    );

    // Keywords
    const jsKeywords = ['const', 'let', 'var', 'function', 'return', 'import', 'export', 'from', 'if', 'else', 'for', 'while', 'switch', 'case', 'default', 'async', 'await', 'try', 'catch'];
    const pyKeywords = ['def', 'return', 'import', 'from', 'if', 'else', 'elif', 'for', 'while', 'class', 'try', 'except', 'with', 'as', 'in', 'is', 'True', 'False', 'None'];
    const keywords = language === 'javascript' ? jsKeywords : pyKeywords;
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    highlightedCode = highlightedCode.replace(
      keywordRegex,
      '<span class="text-primary">$&</span>'
    );

    // Numbers
    highlightedCode = highlightedCode.replace(
      /\b(\d+)\b/g,
      '<span class="text-secondary-foreground/80">$&</span>'
    );
  }
  
  return highlightedCode;
};

const WelcomeView = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-muted-foreground p-8">
    <div className="rounded-full bg-card p-4">
      <FileIcon className="size-12 text-primary" />
    </div>
    <h2 className="font-headline text-2xl font-bold text-foreground">Welcome to Hexivium</h2>
    <p>Select a file from the sidebar to view its contents, or use the AI-powered search to find code snippets across the repository.</p>
  </div>
);

const SearchingView = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-muted-foreground">
    <Loader2 className="size-12 animate-spin text-primary" />
    <h2 className="font-headline text-2xl font-bold text-foreground">Searching...</h2>
    <p>The AI is analyzing the codebase. Please wait a moment.</p>
  </div>
);

const SearchResultsView: React.FC<{ searchResults: { query: string; results: string[] } }> = ({ searchResults }) => {
  if (searchResults.results.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-muted-foreground p-8">
         <div className="rounded-full bg-card p-4">
            <Search className="size-12 text-destructive" />
        </div>
        <h2 className="font-headline text-2xl font-bold text-foreground">No Results Found</h2>
        <p>The AI couldn't find any relevant code for your query: <span className="text-accent">"{searchResults.query}"</span></p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-8">
        <h2 className="font-headline text-3xl font-bold text-foreground mb-2">
          Search Results
        </h2>
        <p className="text-muted-foreground mb-6">
          Showing results for: <span className="text-accent">"{searchResults.query}"</span>
        </p>
        <div className="space-y-4">
          {searchResults.results.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-0">
                <pre className="font-code text-sm p-4 bg-background rounded-lg overflow-auto">
                  <code dangerouslySetInnerHTML={{ __html: highlightSyntax(result, 'javascript') }} />
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};


const FileContentView: React.FC<{ file: File }> = ({ file }) => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="font-headline text-lg font-semibold text-foreground">{file.name}</h2>
      </div>
      <ScrollArea className="flex-grow">
        <pre className="font-code text-sm p-4">
          <code dangerouslySetInnerHTML={{ __html: highlightSyntax(file.content, file.language) }} />
        </pre>
      </ScrollArea>
    </div>
);


export const CodeView: React.FC<CodeViewProps> = ({ file, searchResults, isSearching }) => {
  if (isSearching) {
    return <SearchingView />;
  }

  if (searchResults) {
    return <SearchResultsView searchResults={searchResults} />;
  }

  if (file) {
    return <FileContentView file={file} />;
  }

  return <WelcomeView />;
};
