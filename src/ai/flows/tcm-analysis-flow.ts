
'use server';

/**
 * @fileOverview Provides an AI-driven analysis of a full TCM organ polarity reading.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HexagramAnalysisInputSchema = z.object({
  name: z.string(),
  number: z.string(),
  trigrams: z.object({
    upper: z.string(),
    lower: z.string(),
  }),
  pulseBreakdown: z.array(z.object({
    line: z.number(),
    type: z.string(),
    pulse: z.string(),
    role: z.string(),
  })),
});

const UnifiedHexagramLineSchema = z.object({
    line: z.number(),
    stateLabel: z.string(),
    interpretation: z.string(),
    role: z.string().nullable(),
});

const ComparativeMetricsSchema = z.object({
    hamming_hexagram: z.number(),
    hamming_upper: z.number(),
    hamming_lower: z.number(),
    opposite_hexagram: z.boolean(),
});

const TcmAnalysisInputSchema = z.object({
  celestialHexagram: HexagramAnalysisInputSchema,
  terrestrialHexagram: HexagramAnalysisInputSchema,
  unifiedHexagram: z.array(UnifiedHexagramLineSchema),
  metrics: ComparativeMetricsSchema,
});

export type TcmAnalysisInput = z.infer<typeof TcmAnalysisInputSchema>;

const TcmAnalysisOutputSchema = z.object({
  analysis: z.string().describe("A comprehensive analysis based on TCM principles, integrating all provided data points. The analysis should be insightful, actionable, and structured for clarity, using markdown for formatting."),
});

export type TcmAnalysisOutput = z.infer<typeof TcmAnalysisOutputSchema>;

export async function getTcmAnalysis(input: TcmAnalysisInput): Promise<TcmAnalysisOutput> {
  return tcmAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tcmAnalysisPrompt',
  input: { schema: TcmAnalysisInputSchema },
  output: { schema: TcmAnalysisOutputSchema },
  prompt: `
You are an expert in Traditional Chinese Medicine (TCM), I Ching, and esoteric alchemy. Analyze the following diagnostic data to provide a holistic interpretation.

**Data Provided:**

1.  **Celestial Hexagram (External/Yang Influence):**
    *   Name: {{celestialHexagram.name}} (#{{celestialHexagram.number}})
    *   Trigrams: Upper - {{celestialHexagram.trigrams.upper}}, Lower - {{celestialHexagram.trigrams.lower}}
    *   Pulse Diagnosis:
        {{#each celestialHexagram.pulseBreakdown}}
        *   Line {{line}}: {{type}} ({{role}}) - {{pulse}}
        {{/each}}

2.  **Terrestrial Hexagram (Internal/Yin State):**
    *   Name: {{terrestrialHexagram.name}} (#{{terrestrialHexagram.number}})
    *   Trigrams: Upper - {{terrestrialHexagram.trigrams.upper}}, Lower - {{terrestrialHexagram.trigrams.lower}}
    *   Pulse Diagnosis:
        {{#each terrestrialHexagram.pulseBreakdown}}
        *   Line {{line}}: {{type}} ({{role}}) - {{pulse}}
        {{/each}}

3.  **Comparative Metrics:**
    *   Overall Energetic Difference (Hamming Distance): {{metrics.hamming_hexagram}}/6
    *   Upper Trigram Difference: {{metrics.hamming_upper}}/3
    *   Lower Trigram Difference: {{metrics.hamming_lower}}/3
    *   Hexagrams are Opposites: {{#if metrics.opposite_hexagram}}Yes{{else}}No{{/if}}

4.  **Unified Hexagram (Alchemical Result):**
    This represents the synthesis of the Celestial and Terrestrial energies.
    {{#each unifiedHexagram}}
    *   **Line {{line}} ({{stateLabel}}):** {{interpretation}} {{#if role}}*({{role}})*{{/if}}
    {{/each}}

**Your Task:**

Based on all the data above, provide a comprehensive analysis. Structure your response using Markdown.

*   **Overall Summary:** Start with a brief, high-level interpretation of the user's current energetic state.
*   **Key Imbalances:** Identify the most significant points of harmony or discord. Where is the energy blocked or flowing freely? Use the comparative metrics and unified hexagram to support your findings.
*   **Actionable Advice:** Provide 2-3 concrete suggestions based on your analysis. These could be related to lifestyle, diet, meditation, or specific acupoints to focus on.
*   **Prognosis:** Briefly describe the potential outcome if the advice is followed.

Speak as a wise and insightful master, guiding the user toward greater balance and well-being.
  `,
});

const tcmAnalysisFlow = ai.defineFlow(
  {
    name: 'tcmAnalysisFlow',
    inputSchema: TcmAnalysisInputSchema,
    outputSchema: TcmAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
