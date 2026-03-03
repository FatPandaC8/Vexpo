import { createZodDto } from 'nestjs-zod';
import { CreateBoothSchema } from '@vexpo/schema';

export class CreateBoothContentDTO extends createZodDto(CreateBoothSchema) {}
