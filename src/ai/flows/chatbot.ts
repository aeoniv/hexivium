
'use server';
/**
 * @fileOverview A general-purpose chatbot.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  prompt: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    })),
  })),
});

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: z.string(),
  },
  async ({ prompt, history }) => {
    
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: `You are a helpful assistant. Your goal is to answer user questions and help them navigate the application.
      
      PRESENTATION: When you get a result, present the relevant information to the user in a clear, friendly, and readable way using Markdown.

      If a user says "hi" or something similar, just greet them back.`,
      history: history,
      prompt: prompt,
    });

    return response.text;
  }
);
