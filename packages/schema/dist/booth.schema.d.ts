import { z } from 'zod';
export declare const MAP_ROWS = 5;
export declare const MAP_COLS = 6;
export declare const CreateBoothSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    companyId: z.ZodString;
    modelPath: z.ZodOptional<z.ZodString>;
    mapRow: z.ZodNumber;
    mapCol: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    companyId: string;
    mapRow: number;
    mapCol: number;
    description?: string | undefined;
    modelPath?: string | undefined;
}, {
    name: string;
    companyId: string;
    mapRow: number;
    mapCol: number;
    description?: string | undefined;
    modelPath?: string | undefined;
}>;
export declare const UpdateBoothSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    companyId: z.ZodOptional<z.ZodString>;
    modelPath: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    mapRow: z.ZodOptional<z.ZodNumber>;
    mapCol: z.ZodOptional<z.ZodNumber>;
} & {
    status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected"]>>;
    rejectionReason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    status?: "pending" | "rejected" | "approved" | undefined;
    companyId?: string | undefined;
    modelPath?: string | undefined;
    mapRow?: number | undefined;
    mapCol?: number | undefined;
    rejectionReason?: string | null | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    status?: "pending" | "rejected" | "approved" | undefined;
    companyId?: string | undefined;
    modelPath?: string | undefined;
    mapRow?: number | undefined;
    mapCol?: number | undefined;
    rejectionReason?: string | null | undefined;
}>;
export type CreateBoothDTO = z.infer<typeof CreateBoothSchema>;
export type UpdateBoothDTO = z.infer<typeof UpdateBoothSchema>;
