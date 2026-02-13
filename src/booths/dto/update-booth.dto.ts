import { PartialType } from '@nestjs/swagger';
import { CreateBoothContentDTO } from './create-booth-content.dto';


export class UpdateBoothDTO extends PartialType(CreateBoothContentDTO) {}