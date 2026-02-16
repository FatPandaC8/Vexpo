import { PartialType } from '@nestjs/swagger';
import { CreateBoothContentDTO } from './create-booth-content.dto';

export class UpdateBoothContentDTO extends PartialType(CreateBoothContentDTO) {}
