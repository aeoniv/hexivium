'use client';

import type { File } from '@/lib/repository';
import React, { useState } from 'react';
import { repository } from '@/lib/repository';
import { FileTree } from '@/components/file-tree';
import { CodeView } from '@/components/code-view';
import { SearchForm } from '@/components/search-form';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

type SearchResultState = {
  query: string;
  results: string[];
} | null;

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultState>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSearchResults(null);
  };

  const handleSearch = (query: string, results: string[]) => {
    setSearchResults({ query, results });
    setSelectedFile(null);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <h1 className="font-headline text-2xl font-bold text-primary">Hexivium</h1>
          <p className="text-sm text-muted-foreground">AI Code Browser</p>
        </SidebarHeader>
        <SearchForm onSearch={handleSearch} onSearching={setIsSearching} />
        <Separator className="my-2" />
        <SidebarContent>
          <FileTree
            directory={repository}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
        </SidebarContent>
        <SidebarFooter className="p-2 text-xs text-muted-foreground">
          <p>Built with Next.js and Genkit</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="h-full">
          <CodeView
            file={selectedFile}
            searchResults={searchResults}
            isSearching={isSearching}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
