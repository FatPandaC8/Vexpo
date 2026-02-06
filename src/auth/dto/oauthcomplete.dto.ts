import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";


export class OAuthCompleteDTO {
    @ApiProperty({example: "COMPANY"})
    @IsString()
    @IsIn(['visitor', 'company', 'organizer'])
    role: 'visitor' | 'company' | 'organizer';
}