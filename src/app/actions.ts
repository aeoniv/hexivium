'use server';

import { aiSearchCode } from '@/ai/flows/ai-search-code';
import { repository, type Directory } from '@/lib/repository';

function extractCode(dir: Directory, path: string = ''): string {
  let allCode = '';
  const currentPath = path ? `${path}/${dir.name}` : dir.name;

  for (const file of dir.files) {
    allCode += `
// Path: ${currentPath}/${file.name}
${file.content}
`;
  }

  for (const subDir of dir.directories) {
    allCode += extractCode(subDir, currentPath);
  }

  return allCode;
}

export async function handleSearch(query: string): Promise<{ results: string[]; error: string | null; }> {
  if (!query) {
    return { results: [], error: 'Query cannot be empty.' };
  }
  
  console.log(`Searching for: "${query}"`);

  try {
    const codebase = extractCode(repository);
    if (!codebase) {
      return { results: [], error: 'Could not read repository files.' };
    }
    const response = await aiSearchCode({ query, codebase });
    console.log(`Found ${response.results.length} results.`);
    return { results: response.results || [], error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred during search.';
    console.error('AI Search Error:', error);
    return { results: [], error: `AI Search failed: ${error}` };
  }
}
