import { RegisterCompanySchema } from '@vexpo/schema';
import { createZodDto } from 'nestjs-zod';

export class RegisterCompanyDTO extends createZodDto(RegisterCompanySchema) {}
