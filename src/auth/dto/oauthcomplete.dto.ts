import { IsIn, IsString } from "class-validator";


export class OAuthCompleteDTO {
    @IsString()
    @IsIn(['visitor', 'company', 'organizer'])
    role: 'visitor' | 'company' | 'organizer';
}