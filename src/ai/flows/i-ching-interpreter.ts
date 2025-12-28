
'use server';

/**
 * @fileOverview Provides an AI-driven interpretation of a cast I Ching reading.
 *
 * - interpretIChingReading - A function that generates an interpretation.
 * - InterpretIChingReadingInput - The input type for the function.
 * - InterpretIChingReadingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretIChingReadingInputSchema = z.object({
  earthlyHexagramName: z.string().describe("The name of the earthly hexagram (internal state)."),
  heavenlyHexagramName: z.string().describe("The name of the heavenly hexagram (external state)."),
  changingLines: z.array(z.string()).describe("A list of the changing lines and their meanings, which describe the transition between the states."),
});
export type InterpretIChingReadingInput = z.infer<typeof InterpretIChingReadingInputSchema>;

const InterpretIChingReadingOutputSchema = z.object({
  interpretation: z.string().describe("A concise, insightful interpretation of the I Ching reading provided. It should be presented as wisdom from an oracle."),
});
export type InterpretIChingReadingOutput = z.infer<typeof InterpretIChingReadingOutputSchema>;

export async function interpretIChingReading(input: InterpretIChingReadingInput): Promise<InterpretIChingReadingOutput> {
  return interpretIChingReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretIChingReadingPrompt',
  input: {schema: InterpretIChingReadingInputSchema},
  output: {schema: InterpretIChingReadingOutputSchema},
  prompt: `As an I Ching oracle, interpret the following reading:

- Internal State (Earthly Hexagram): {{earthlyHexagramName}}
- External State (Heavenly Hexagram): {{heavenlyHexagramName}}
- Path of Change (Changing Lines): {{#if changingLines}}The transition is influenced by: {{changingLines}}.{{else}}There are no changing lines; the situation is stable.{{/if}}

Synthesize these elements into a concise, direct interpretation. Focus on the core meaning of the transition from the internal state to the external state, informed by the wisdom of the changing lines.`,
});

const interpretIChingReadingFlow = ai.defineFlow(
  {
    name: 'interpretIChingReadingFlow',
    inputSchema: InterpretIChingReadingInputSchema,
    outputSchema: InterpretIChingReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
