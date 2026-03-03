import { z } from 'zod';
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    role: string;
    email: string;
}, {
    name: string;
    role: string;
    email: string;
}>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
