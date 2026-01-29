'use server';

/**
 * @fileOverview Estimates the cooling load for a given room based on its geometry, environmental conditions, and usage parameters.
 *
 * - estimateCoolingLoad - A function that handles the cooling load estimation process.
 * - EstimateCoolingLoadInput - The input type for the estimateCoolingLoad function.
 * - EstimateCoolingLoadOutput - The return type for the estimateCoolingLoad function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateCoolingLoadInputSchema = z.object({
  roomLength: z.number().describe('Room length in meters.'),
  roomWidth: z.number().describe('Room width in meters.'),
  roomHeight: z.number().describe('Room height in meters.'),
  roomShape: z.enum(['rectangular', 'L-shape', 'custom']).describe('Room shape.'),
  numWindows: z.number().describe('Number of windows.'),
  windowSizeAndOrientation: z
    .string()
    .describe('Window size and orientation (N / S / E / W).'),
  numDoors: z.number().describe('Number of doors.'),
  ceilingType: z.enum(['normal', 'false ceiling']).describe('Ceiling type.'),
  locationCity: z.string().describe('Location / city.'),
  outdoorDesignTemperature: z.number().describe('Outdoor design temperature in °C.'),
  humidityLevel: z.enum(['low', 'medium', 'high']).describe('Humidity level.'),
  sunExposure: z.enum(['low', 'moderate', 'high']).describe('Sun exposure.'),
  roomType: z
    .enum(['bedroom', 'office', 'classroom', 'server room', 'hall', 'shop'])
    .describe('Room type.'),
  numOccupants: z.number().describe('Number of occupants.'),
  occupancyDuration: z.number().describe('Occupancy duration in hours/day.'),
  internalHeatSources: z.string().describe('Internal heat sources (computers, machines, lighting).'),
  usagePattern: z.enum(['continuous', 'intermittent']).describe('Usage pattern.'),
});
export type EstimateCoolingLoadInput = z.infer<typeof EstimateCoolingLoadInputSchema>;

const EstimateCoolingLoadOutputSchema = z.object({
  coolingLoadEstimate: z
    .string()
    .describe('Estimated cooling load, including key heat gain factors and assumptions.'),
});
export type EstimateCoolingLoadOutput = z.infer<typeof EstimateCoolingLoadOutputSchema>;

export async function estimateCoolingLoad(input: EstimateCoolingLoadInput): Promise<EstimateCoolingLoadOutput> {
  return estimateCoolingLoadFlow(input);
}

const estimateCoolingLoadPrompt = ai.definePrompt({
  name: 'estimateCoolingLoadPrompt',
  input: {schema: EstimateCoolingLoadInputSchema},
  output: {schema: EstimateCoolingLoadOutputSchema},
  prompt: `You are a professional HVAC design engineer. Based on the following inputs, estimate the cooling load for a room, clearly stating assumptions where exact data is missing. Consider room volume, occupancy heat gain, equipment heat load, solar heat gain through windows, location, and climate.

Room Geometry:
- Room length: {{{roomLength}}} m
- Room width: {{{roomWidth}}} m
- Room height: {{{roomHeight}}} m
- Room shape: {{{roomShape}}}
- Number of windows: {{{numWindows}}}
- Window size and orientation: {{{windowSizeAndOrientation}}}
- Number of doors: {{{numDoors}}}
- Ceiling type: {{{ceilingType}}}

Environmental Conditions:
- Location: {{{locationCity}}}
- Outdoor design temperature: {{{outdoorDesignTemperature}}} °C
- Humidity level: {{{humidityLevel}}}
- Sun exposure: {{{sunExposure}}}

Room Usage:
- Room type: {{{roomType}}}
- Number of occupants: {{{numOccupants}}}
- Occupancy duration: {{{occupancyDuration}}} hours/day
- Internal heat sources: {{{internalHeatSources}}}
- Usage pattern: {{{usagePattern}}}

Respond with your cooling load estimation, key heat gain factors, and assumptions made in your estimation.
`,
});

const estimateCoolingLoadFlow = ai.defineFlow(
  {
    name: 'estimateCoolingLoadFlow',
    inputSchema: EstimateCoolingLoadInputSchema,
    outputSchema: EstimateCoolingLoadOutputSchema,
  },
  async input => {
    const {output} = await estimateCoolingLoadPrompt(input);
    return output!;
  }
);

