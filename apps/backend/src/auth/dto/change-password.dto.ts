import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export class ChangePasswordDTO extends createZodDto(ChangePasswordSchema) {}