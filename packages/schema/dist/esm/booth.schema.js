import { z } from 'zod';
export const MAP_ROWS = 5;
export const MAP_COLS = 6;
export const CreateBoothSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    companyId: z.string().optional(),
    modelPath: z.string().optional(),
    mapRow: z.number().int().min(0).max(MAP_ROWS - 1),
    mapCol: z.number().int().min(0).max(MAP_COLS - 1),
});
export const UpdateBoothSchema = CreateBoothSchema.partial().extend({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
});
