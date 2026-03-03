import { createZodDto } from 'nestjs-zod';
import { RegisterSchema } from '@vexpo/schema';

export class RegisterDTO extends createZodDto(RegisterSchema) {}
