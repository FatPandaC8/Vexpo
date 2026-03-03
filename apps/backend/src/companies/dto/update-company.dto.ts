import { createZodDto } from 'nestjs-zod';
import { UpdateCompanySchema } from '@vexpo/schema';

export class UpdateCompanyDto extends createZodDto(UpdateCompanySchema) {}
