import { Controller, Get, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Public } from 'src/auth/jwt-auth.guard';

@Controller('companies')
export class CompaniesController {
    constructor(private companyService: CompaniesService) {}

    @Public()
    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.companyService.findAllPaginated(page, limit);
    }
}
