import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const SendEmailSchema = z.object({
  recipients: z.array(z.string().email()),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().optional(),
});

export class SendEmailDTOo extends createZodDto(SendEmailSchema) {}