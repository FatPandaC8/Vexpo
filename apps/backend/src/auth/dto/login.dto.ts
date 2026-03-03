import { LoginSchema } from '@vexpo/schema';
import { createZodDto } from 'nestjs-zod';

export class LoginDTO extends createZodDto(LoginSchema) {}
