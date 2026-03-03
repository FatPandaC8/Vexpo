import { z } from 'zod';
export declare const CreateExpoSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    description?: string | undefined;
    website?: string | undefined;
}, {
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    description?: string | undefined;
    website?: string | undefined;
}>;
export declare const UpdateExpoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    website: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    type?: string | undefined;
    description?: string | undefined;
    website?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    name?: string | undefined;
    type?: string | undefined;
    description?: string | undefined;
    website?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export type CreateExpoDTO = z.infer<typeof CreateExpoSchema>;
export type UpdateExpoDTO = z.infer<typeof UpdateExpoSchema>;
