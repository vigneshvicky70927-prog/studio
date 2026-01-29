'use server';

/**
 * @fileOverview A flow to recommend AC capacity based on room parameters.
 *
 * - recommendAcCapacity - A function that recommends AC capacity.
 * - RecommendAcCapacityInput - The input type for the recommendAcCapacity function.
 * - RecommendAcCapacityOutput - The return type for the recommendAcCapacity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendAcCapacityInputSchema = z.object({
  roomLength: z.number().describe('Room length in meters.'),
  roomWidth: z.number().describe('Room width in meters.'),
  roomHeight: z.number().describe('Room height in meters.'),
  roomShape: z.enum(['rectangular', 'L-shape', 'custom']).describe('Room shape.'),
  numberOfWindows: z.number().describe('Number of windows.'),
  windowSizeAndOrientation: z
    .string()
    .describe('Window size and orientation (N / S / E / W).'),
  numberOfDoors: z.number().describe('Number of doors.'),
  ceilingType: z.enum(['normal', 'false ceiling']).describe('Ceiling type.'),
  locationCity: z.string().describe('Location / city.'),
  outdoorDesignTemperature: z.number().describe('Outdoor design temperature (°C).'),
  humidityLevel: z.enum(['low', 'medium', 'high']).describe('Humidity level.'),
  sunExposure: z.enum(['low', 'moderate', 'high']).describe('Sun exposure.'),
  roomType: z
    .enum(['bedroom', 'office', 'classroom', 'server room', 'hall', 'shop'])
    .describe('Room type.'),
  numberOfOccupants: z.number().describe('Number of occupants.'),
  occupancyDuration: z.number().describe('Occupancy duration (hours/day).'),
  internalHeatSources: z.string().describe('Internal heat sources (computers, machines, lighting).'),
  usagePattern: z.enum(['continuous', 'intermittent']).describe('Usage pattern.'),
});
export type RecommendAcCapacityInput = z.infer<typeof RecommendAcCapacityInputSchema>;

const RecommendAcCapacityOutputSchema = z.object({
  acCapacityTr: z.number().describe('Recommended AC capacity in Tons of Refrigeration (TR).'),
  acCapacityKw: z.number().optional().describe('Recommended AC capacity in kW (optional).'),
  suggestedUnits: z
    .string()
    .describe('Suggestion for single unit or multiple units.'),
  acType: z
    .enum(['Split AC', 'Cassette', 'Ducted', 'VRF'])
    .describe('Recommended AC type based on room type.'),
});
export type RecommendAcCapacityOutput = z.infer<typeof RecommendAcCapacityOutputSchema>;

export async function recommendAcCapacity(
  input: RecommendAcCapacityInput
): Promise<RecommendAcCapacityOutput> {
  return recommendAcCapacityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendAcCapacityPrompt',
  input: {schema: RecommendAcCapacityInputSchema},
  output: {schema: RecommendAcCapacityOutputSchema},
  prompt: `You are an expert HVAC design engineer. Based on the following room parameters, recommend an appropriate AC capacity.

Room Geometry:
- Room length: {{roomLength}} m
- Room width: {{roomWidth}} m
- Room height: {{roomHeight}} m
- Room shape: {{roomShape}}
- Number of windows: {{numberOfWindows}}
- Window size and orientation: {{windowSizeAndOrientation}}
- Number of doors: {{numberOfDoors}}
- Ceiling type: {{ceilingType}}

Environmental Conditions:
- Location: {{locationCity}}
- Outdoor design temperature: {{outdoorDesignTemperature}} °C
- Humidity level: {{humidityLevel}}
- Sun exposure: {{sunExposure}}

Room Usage:
- Room type: {{roomType}}
- Number of occupants: {{numberOfOccupants}}
- Occupancy duration: {{occupancyDuration}} hours/day
- Internal heat sources: {{internalHeatSources}}
- Usage pattern: {{usagePattern}}


Consider the room volume, occupancy heat gain, equipment heat load, solar heat gain through windows, location & climate to estimate the cooling load. Recommend AC capacity in Tons of Refrigeration (TR), suggest single or multiple units, and recommend an AC type (Split AC, Cassette, Ducted, VRF) based on room type and cooling load.

Return the AC capacity in acCapacityTr, AC capacity in kW in acCapacityKw (optional), suggestion for single unit or multiple units in suggestedUnits, and the recommended AC type in acType. Do not return anything else.`,
});

const recommendAcCapacityFlow = ai.defineFlow(
  {
    name: 'recommendAcCapacityFlow',
    inputSchema: RecommendAcCapacityInputSchema,
    outputSchema: RecommendAcCapacityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
