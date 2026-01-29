'use server';

/**
 * @fileOverview An AI agent for defining airflow direction and distribution in HVAC systems.
 *
 * - defineAirflowDirection - A function that defines the recommended airflow direction and coverage strategy.
 * - DefineAirflowDirectionInput - The input type for the defineAirflowDirection function.
 * - DefineAirflowDirectionOutput - The return type for the defineAirflowDirection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefineAirflowDirectionInputSchema = z.object({
  roomLength: z.number().describe('The length of the room in meters.'),
  roomWidth: z.number().describe('The width of the room in meters.'),
  roomHeight: z.number().describe('The height of the room in meters.'),
  roomType: z.string().describe('The type of the room (e.g., bedroom, office, classroom).'),
  numberOfOccupants: z.number().describe('The number of occupants in the room.'),
});
export type DefineAirflowDirectionInput = z.infer<typeof DefineAirflowDirectionInputSchema>;

const DefineAirflowDirectionOutputSchema = z.object({
  airflowDirection: z.string().describe('The recommended airflow direction (horizontal, angled, multi-directional).'),
  coverageStrategy: z.string().describe('The suggested air distribution strategy.'),
  throwLengthConsideration: z.string().describe('Consideration of throw length to achieve optimal comfort.'),
  draftAvoidance: z.string().describe('Explanation of how to avoid direct drafts on occupants.'),
});
export type DefineAirflowDirectionOutput = z.infer<typeof DefineAirflowDirectionOutputSchema>;

export async function defineAirflowDirection(input: DefineAirflowDirectionInput): Promise<DefineAirflowDirectionOutput> {
  return defineAirflowDirectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'defineAirflowDirectionPrompt',
  input: {schema: DefineAirflowDirectionInputSchema},
  output: {schema: DefineAirflowDirectionOutputSchema},
  prompt: `You are an expert HVAC engineer specializing in airflow design for optimal comfort and efficiency.

  Based on the room dimensions, type, and occupancy, recommend the best airflow direction and distribution strategy, taking into account throw length and avoiding direct drafts on occupants.

  Room Length: {{{roomLength}}} meters
  Room Width: {{{roomWidth}}} meters
  Room Height: {{{roomHeight}}} meters
  Room Type: {{{roomType}}}
  Number of Occupants: {{{numberOfOccupants}}}

  Respond with a structured explanation of airflow direction, coverage strategy, throw length consideration, and draft avoidance techniques.
  Ensure the explanation is suitable for a non-expert to understand.
`,
});

const defineAirflowDirectionFlow = ai.defineFlow(
  {
    name: 'defineAirflowDirectionFlow',
    inputSchema: DefineAirflowDirectionInputSchema,
    outputSchema: DefineAirflowDirectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
