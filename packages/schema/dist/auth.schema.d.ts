import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["exhibitor", "organizer"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    role: "exhibitor" | "organizer";
    email: string;
    password: string;
}, {
    name: string;
    role: "exhibitor" | "organizer";
    email: string;
    password: string;
}>;
export declare const OAuthCompleteSchema: z.ZodObject<{
    role: z.ZodEnum<["exhibitor", "organizer"]>;
}, "strip", z.ZodTypeAny, {
    role: "exhibitor" | "organizer";
}, {
    role: "exhibitor" | "organizer";
}>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type OAuthCompleteDTO = z.infer<typeof OAuthCompleteSchema>;
