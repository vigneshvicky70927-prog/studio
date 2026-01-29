import { z } from 'zod';

const positiveNumber = (fieldName: string) => z.coerce.number().min(0.01, `${fieldName} must be positive`);
const nonNegativeNumber = (fieldName: string) => z.coerce.number().min(0, `${fieldName} cannot be negative`);
const requiredString = (fieldName: string) => z.string().min(1, `${fieldName} is required`);

export const hvacFormSchema = z.object({
  // Room Geometry
  roomLength: positiveNumber('Room length'),
  roomWidth: positiveNumber('Room width'),
  roomHeight: positiveNumber('Room height'),
  roomShape: z.enum(['rectangular', 'L-shape', 'custom']),
  numberOfWindows: nonNegativeNumber('Number of windows'),
  windowSizeAndOrientation: requiredString('Window size and orientation'),
  numberOfDoors: nonNegativeNumber('Number of doors'),
  ceilingType: z.enum(['normal', 'false ceiling']),

  // Environmental Conditions
  locationCity: requiredString('Location/city'),
  outdoorDesignTemperature: z.coerce.number(),
  humidityLevel: z.enum(['low', 'medium', 'high']),
  sunExposure: z.enum(['low', 'moderate', 'high']),

  // Room Usage
  roomType: z.enum(['bedroom', 'office', 'classroom', 'server room', 'hall', 'shop']),
  numberOfOccupants: nonNegativeNumber('Number of occupants'),
  occupancyDuration: nonNegativeNumber('Occupancy duration'),
  internalHeatSources: requiredString('Internal heat sources'),
  usagePattern: z.enum(['continuous', 'intermittent']),
});

export type HvacFormValues = z.infer<typeof hvacFormSchema>;
