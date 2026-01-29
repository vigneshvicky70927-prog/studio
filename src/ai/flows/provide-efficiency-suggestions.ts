'use server';

/**
 * @fileOverview A flow for providing energy efficiency suggestions for HVAC systems.
 *
 * - provideEfficiencySuggestions - A function that generates energy efficiency tips.
 * - EfficiencySuggestionsInput - The input type for the provideEfficiencySuggestions function.
 * - EfficiencySuggestionsOutput - The return type for the provideEfficiencySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EfficiencySuggestionsInputSchema = z.object({
  roomType: z.string().describe('The type of room (e.g., bedroom, office, server room).'),
  climate: z.string().describe('The climate or location (e.g., hot and humid, cold and dry).'),
  existingInsulation: z.string().optional().describe('Details about the existing insulation.'),
  windowShading: z.string().optional().describe('Details about existing window shading measures.'),
  thermostatSettings: z.string().optional().describe('Current thermostat settings.'),
});
export type EfficiencySuggestionsInput = z.infer<typeof EfficiencySuggestionsInputSchema>;

const EfficiencySuggestionsOutputSchema = z.object({
  energySavingTips: z.string().describe('Actionable tips for improving energy efficiency, including suggestions for inverter ACs, insulation improvements, window shading, and thermostat settings.'),
});
export type EfficiencySuggestionsOutput = z.infer<typeof EfficiencySuggestionsOutputSchema>;

export async function provideEfficiencySuggestions(input: EfficiencySuggestionsInput): Promise<EfficiencySuggestionsOutput> {
  return provideEfficiencySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'efficiencySuggestionsPrompt',
  input: {schema: EfficiencySuggestionsInputSchema},
  output: {schema: EfficiencySuggestionsOutputSchema},
  prompt: `You are an expert in energy efficiency for HVAC systems. Based on the following information, provide actionable tips for improving energy efficiency.

Room Type: {{{roomType}}}
Climate: {{{climate}}}
Existing Insulation: {{{existingInsulation}}}
Window Shading: {{{windowShading}}}
Thermostat Settings: {{{thermostatSettings}}}

Consider suggesting inverter ACs, insulation improvements, window shading strategies, and optimal thermostat settings. Focus on practical and cost-effective solutions.

Output the tips in a concise and easy-to-understand format.
`,
});

const provideEfficiencySuggestionsFlow = ai.defineFlow(
  {
    name: 'provideEfficiencySuggestionsFlow',
    inputSchema: EfficiencySuggestionsInputSchema,
    outputSchema: EfficiencySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
