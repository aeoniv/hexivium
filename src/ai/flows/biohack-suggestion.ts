'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating biohacking suggestions based on the current day's hexagram.
 *
 * @module src/ai/flows/biohack-suggestion
 *
 * @typedef {Object} BiohackSuggestionInput
 * @property {string} hexagramDescription - The description of the current day's hexagram.
 *
 * @typedef {Object} BiohackSuggestionOutput
 * @property {string} suggestion - A personalized biohacking suggestion based on the hexagram description.
 *
 * @function biohackSuggestion
 * @param {BiohackSuggestionInput} input - The input for the biohackSuggestion function.
 * @returns {Promise<BiohackSuggestionOutput>} - A promise that resolves to a BiohackSuggestionOutput object.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BiohackSuggestionInputSchema = z.object({
  hexagramDescription: z.string().describe('The description of the current day\'s hexagram.'),
});

export type BiohackSuggestionInput = z.infer<typeof BiohackSuggestionInputSchema>;

const BiohackSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('A personalized biohacking suggestion based on the hexagram description.'),
});

export type BiohackSuggestionOutput = z.infer<typeof BiohackSuggestionOutputSchema>;


export async function biohackSuggestion(input: BiohackSuggestionInput): Promise<BiohackSuggestionOutput> {
  return biohackSuggestionFlow(input);
}

const biohackSuggestionPrompt = ai.definePrompt({
  name: 'biohackSuggestionPrompt',
  input: {schema: BiohackSuggestionInputSchema},
  output: {schema: BiohackSuggestionOutputSchema},
  prompt: `Based on the following hexagram description, provide a single, actionable biohacking suggestion to optimize well-being and personal growth:

Hexagram Description: {{{hexagramDescription}}}

Suggestion: `,
});

const biohackSuggestionFlow = ai.defineFlow(
  {
    name: 'biohackSuggestionFlow',
    inputSchema: BiohackSuggestionInputSchema,
    outputSchema: BiohackSuggestionOutputSchema,
  },
  async input => {
    const {output} = await biohackSuggestionPrompt(input);
    return output!;
  }
);
