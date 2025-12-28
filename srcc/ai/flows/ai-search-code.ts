'use server';

/**
 * @fileOverview An AI-powered code search flow.
 *
 * - aiSearchCode - A function that handles the code search process.
 * - AiSearchCodeInput - The input type for the aiSearchCode function.
 * - AiSearchCodeOutput - The return type for the aiSearchCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSearchCodeInputSchema = z.object({
  query: z.string().describe('The natural language query to search for.'),
  codebase: z.string().describe('The entire codebase as a single string.'),
});
export type AiSearchCodeInput = z.infer<typeof AiSearchCodeInputSchema>;

const AiSearchCodeOutputSchema = z.object({
  results: z
    .array(z.string())
    .describe('A list of code snippets that match the query.'),
});
export type AiSearchCodeOutput = z.infer<typeof AiSearchCodeOutputSchema>;

export async function aiSearchCode(input: AiSearchCodeInput): Promise<AiSearchCodeOutput> {
  return aiSearchCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSearchCodePrompt',
  input: {schema: AiSearchCodeInputSchema},
  output: {schema: AiSearchCodeOutputSchema},
  prompt: `You are an AI code search assistant. Given a codebase and a query, you will return a list of code snippets that match the query.

Query: {{{query}}}

Codebase: {{{codebase}}}

Return only the relevant code snippets. If there are no relevant snippets, return an empty array.
`,
});

const aiSearchCodeFlow = ai.defineFlow(
  {
    name: 'aiSearchCodeFlow',
    inputSchema: AiSearchCodeInputSchema,
    outputSchema: AiSearchCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
