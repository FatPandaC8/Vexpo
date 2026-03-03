import { CreateExpoSchema } from '@vexpo/schema';
import { createZodDto } from 'nestjs-zod';

export class CreateExpoDTO extends createZodDto(CreateExpoSchema) {}
