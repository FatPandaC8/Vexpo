import { UpdateBoothSchema } from '@vexpo/schema';
import { createZodDto } from 'nestjs-zod';

export class UpdateBoothDTO extends createZodDto(UpdateBoothSchema) {}
