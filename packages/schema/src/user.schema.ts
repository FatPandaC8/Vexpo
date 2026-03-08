import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().min(4, 'Min name length is 4'),
  email: z.string().email(),
  role: z.string().min(1, 'Select a role'),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  {message: 'At least one field must be provided'},
);

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;