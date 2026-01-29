'use server';

/**
 * @fileOverview Recommends the optimal indoor AC unit position, including mounting type and distance from ceiling/walls.
 *
 * - suggestOptimalAcPlacement - A function that recommends the optimal AC placement.
 * - SuggestOptimalAcPlacementInput - The input type for the suggestOptimalAcPlacement function.
 * - SuggestOptimalAcPlacementOutput - The return type for the suggestOptimalAcPlacement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalAcPlacementInputSchema = z.object({
  roomLength: z.number().describe('Room length in meters.'),
  roomWidth: z.number().describe('Room width in meters.'),
  roomHeight: z.number().describe('Room height in meters.'),
  roomType: z
    .string()
    .describe(
      'Room type (e.g., bedroom, office, classroom, server room, hall, shop)'
    ),
});

export type SuggestOptimalAcPlacementInput = z.infer<
  typeof SuggestOptimalAcPlacementInputSchema
>;

const SuggestOptimalAcPlacementOutputSchema = z.object({
  recommendedPosition: z.string().describe('Recommended AC unit position.'),
  mountingHeight: z.string().describe('Mounting height of the AC unit.'),
  reasoning: z.string().describe('Reasoning for the recommended position.'),
});

export type SuggestOptimalAcPlacementOutput = z.infer<
  typeof SuggestOptimalAcPlacementOutputSchema
>;

export async function suggestOptimalAcPlacement(
  input: SuggestOptimalAcPlacementInput
): Promise<SuggestOptimalAcPlacementOutput> {
  return suggestOptimalAcPlacementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalAcPlacementPrompt',
  input: {schema: SuggestOptimalAcPlacementInputSchema},
  output: {schema: SuggestOptimalAcPlacementOutputSchema},
  prompt: `You are an expert HVAC engineer. Based on the room dimensions and type, recommend the optimal AC unit placement.

Room Length: {{roomLength}} meters
Room Width: {{roomWidth}} meters
Room Height: {{roomHeight}} meters
Room Type: {{roomType}}

Consider air circulation, comfort, and efficiency. Provide the recommended position, mounting height, and reasoning.

Ensure the reasoning is easily understandable for non-experts.

Return the result in the following structured format:

Recommended Position: [position]
Mounting Height: [height]
Reasoning: [reasoning]`,
});

const suggestOptimalAcPlacementFlow = ai.defineFlow(
  {
    name: 'suggestOptimalAcPlacementFlow',
    inputSchema: SuggestOptimalAcPlacementInputSchema,
    outputSchema: SuggestOptimalAcPlacementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
