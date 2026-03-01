import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Repository } from 'typeorm';
import { RegisterCompanyDTO } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async findAllPaginated(page: number = 1, limit: number = 20) {
    const [items, total] = await this.companyRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCompanyByExhibitor(exhibitorId: string) {
    return await this.companyRepository.findOneBy({
      exhibitorId: exhibitorId,
    });
  }

  async findById(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['booths'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async registerCompany(
    userId: string,
    dto: RegisterCompanyDTO,
  ): Promise<string> {
    const company = this.companyRepository.create({
      ...dto,
      exhibitorId: userId,
    });
    this.companyRepository.save(company);

    // after creating the company, it should auto give back the id of it self
    return company.id;
  }

  async updateCompany(id: string, dto: UpdateCompanyDto) {
    const company = await this.findById(id);
    Object.assign(company, dto);
    return this.companyRepository.save(company);
  }

  async deleteCompany(id: string) {
    const company = await this.findById(id);
    await this.companyRepository.remove(company);
    return { message: 'Company deleted successfully' };
  }
}
