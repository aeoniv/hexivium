
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing CSV data.
 *
 * @module src/ai/flows/data-analysis-flow
 *
 * @typedef {Object} DataAnalysisInput
 * @property {string} csvData - The CSV data as a string.
 * @property {string} question - The user's question about the data.
 *
 * @typedef {Object} DataAnalysisOutput
 * @property {string} analysis - The AI-generated analysis of the data.
 *
 * @function dataAnalysis
 * @param {DataAnalysisInput} input - The input for the dataAnalysis function.
 * @returns {Promise<DataAnalysisOutput>} - A promise that resolves to a DataAnalysisOutput object.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DataAnalysisInputSchema = z.object({
  csvData: z.string().describe('A string containing data in CSV format, including a header row.'),
  question: z.string().describe('A natural language question about the provided CSV data.'),
});
export type DataAnalysisInput = z.infer<typeof DataAnalysisInputSchema>;

const DataAnalysisOutputSchema = z.object({
  analysis: z.string().describe('The AI-generated analysis and answer based on the data and question.'),
});
export type DataAnalysisOutput = z.infer<typeof DataAnalysisOutputSchema>;

export async function dataAnalysis(input: DataAnalysisInput): Promise<DataAnalysisOutput> {
  return dataAnalysisFlow(input);
}

const dataAnalysisPrompt = ai.definePrompt({
  name: 'dataAnalysisPrompt',
  input: { schema: DataAnalysisInputSchema },
  output: { schema: DataAnalysisOutputSchema },
  prompt: `You are an expert data analyst. You will be given a dataset in CSV format and a question. Your task is to analyze the data to answer the question.

Provide a clear and concise answer. If the question requires calculations, perform them and show the result.

Dataset (CSV):
\`\`\`csv
{{{csvData}}}
\`\`\`

Question: {{{question}}}

Analysis:`,
});

const dataAnalysisFlow = ai.defineFlow(
  {
    name: 'dataAnalysisFlow',
    inputSchema: DataAnalysisInputSchema,
    outputSchema: DataAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await dataAnalysisPrompt(input);
    return output!;
  }
);
