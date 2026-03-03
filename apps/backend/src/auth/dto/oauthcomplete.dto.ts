import { OAuthCompleteSchema } from '@vexpo/schema';
import { createZodDto } from 'nestjs-zod';

export class OAuthCompleteDTO extends createZodDto(OAuthCompleteSchema) {}
