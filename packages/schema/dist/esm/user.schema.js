import { z } from 'zod';
export const UpdateUserSchema = z.object({
    name: z.string().min(4, 'Min name length is 4'),
    email: z.string().email(),
    role: z.string().min(1, 'Select a role'),
});
