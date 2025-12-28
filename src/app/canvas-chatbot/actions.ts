
'use server';

import { chatbotFlow } from '@/ai/flows/chatbot';

export async function handleChat(prompt: string, history: any[]): Promise<string> {
  try {
    const response = await chatbotFlow({
      prompt: prompt,
      history: history,
    });

    return response;
    
  } catch (error: any) {
    console.error('Error in handleChat server action:', error);
    throw new Error(error.message || 'An unexpected error occurred while processing your request.');
  }
}
