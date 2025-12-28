import {genkit, type GenkitErrorCode} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

class GenkitError extends Error {
  constructor(
    message: string,
    public readonly code?: GenkitErrorCode
  ) {
    super(message);
    this.name = 'GenkitError';
  }
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
  error: (err, code) => {
    throw new GenkitError(err.message, code);
  },
});
