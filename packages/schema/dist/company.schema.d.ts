import { z } from 'zod';
export declare const RegisterCompanySchema: z.ZodObject<{
    name: z.ZodString;
    industry: z.ZodString;
    country: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    industry: string;
    country?: string | undefined;
    email?: string | undefined;
    description?: string | undefined;
    city?: string | undefined;
    website?: string | undefined;
}, {
    name: string;
    industry: string;
    country?: string | undefined;
    email?: string | undefined;
    description?: string | undefined;
    city?: string | undefined;
    website?: string | undefined;
}>;
export declare const UpdateCompanySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    website: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    country?: string | undefined;
    email?: string | undefined;
    description?: string | undefined;
    industry?: string | undefined;
    city?: string | undefined;
    website?: string | undefined;
}, {
    name?: string | undefined;
    country?: string | undefined;
    email?: string | undefined;
    description?: string | undefined;
    industry?: string | undefined;
    city?: string | undefined;
    website?: string | undefined;
}>;
export type RegisterCompanyDTO = z.infer<typeof RegisterCompanySchema>;
export type UpdateCompanyDTO = z.infer<typeof UpdateCompanySchema>;
