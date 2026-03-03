import { UpdateBoothSchema } from '@vexpo/schema';
import { createZodDto } from 'nestjs-zod';

export class UpdateExpoDTO extends createZodDto(UpdateBoothSchema) {
  // https://docs.nestjs.com/openapi/mapped-types
  // update expo dto has mapped all the fields of create expo dto but make they're optional
  // Choose PartialType insread of others because i want the update can be able to change everything
  // of the expo.
}
