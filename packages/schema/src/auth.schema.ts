import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['exhibitor', 'organizer']),
});

export const OAuthCompleteSchema = z.object({
  role: z.enum(['exhibitor', 'organizer']),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type OAuthCompleteDTO = z.infer<typeof OAuthCompleteSchema>;