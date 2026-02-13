import { PartialType } from "@nestjs/swagger";
import { CreateExpoDTO } from "src/expos/dto/create-expo.dto";


export class UpdateExpoDTO extends PartialType(CreateExpoDTO) {
    // https://docs.nestjs.com/openapi/mapped-types 
    // update expo dto has mapped all the fields of create expo dto but make they're optional
    // Choose PartialType insread of others because i want the update can be able to change everything
    // of the expo.
}