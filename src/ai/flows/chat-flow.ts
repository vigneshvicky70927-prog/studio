'use server';

/**
 * @fileOverview A conversational AI for answering HVAC questions.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  content: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const {history} = input;

    const systemPrompt = `You are an expert HVAC design assistant. Your goal is to help users with their questions about HVAC systems, the design process, and how to use this tool. Be friendly, helpful, and concise.

    The user is interacting with an HVAC design tool that helps them determine the right AC capacity and system design for their space. They provide inputs like room size, location, and usage, and the tool generates a detailed HVAC design summary.

    Your role is to:
    1. Answer general questions about HVAC concepts (e.g., "What is a TR?", "What's the difference between a split and a cassette AC?").
    2. Help users understand the input fields in the form (e.g., "What does 'sun exposure' mean?").
    3. Explain the results of the generated design summary (e.g., "Why was a 2 TR unit recommended?").
    4. Provide general energy-saving tips related to HVAC.

    Keep your answers focused on the context of HVAC design and this tool. Do not answer questions outside of this scope.
    `;

    const response = await ai.generate({
        prompt: [
            {text: systemPrompt},
            ...history.map(msg => ({ text: msg.content, role: msg.role === 'model' ? 'model' : 'user' }))
        ],
        config: {
            temperature: 0.5,
        }
    });

    return { content: response.text };
  }
);
