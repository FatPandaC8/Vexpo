import { z } from 'zod';

export const CreateExpoSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  startDate: z.string().date(),
  endDate: z.string().date(),
  description: z.string().optional(),
  website: z.string().url().optional(),
});

export const UpdateExpoSchema = CreateExpoSchema.partial();

export type CreateExpoDTO = z.infer<typeof CreateExpoSchema>;
export type UpdateExpoDTO = z.infer<typeof UpdateExpoSchema>;