import { PartialType } from '@nestjs/swagger';
import { RegisterCompanyDTO } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(RegisterCompanyDTO) {}
