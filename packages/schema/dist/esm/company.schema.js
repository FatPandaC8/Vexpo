import { z } from 'zod';
export const RegisterCompanySchema = z.object({
    name: z.string().min(1),
    industry: z.string(),
    country: z.string().optional(),
    city: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    description: z.string().optional(),
});
export const UpdateCompanySchema = RegisterCompanySchema.partial();
