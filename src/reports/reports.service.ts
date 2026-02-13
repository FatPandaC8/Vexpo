import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async findAll(filters: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = filters;
    const query = this.reportRepository.createQueryBuilder('report');

    if (status) {
      query.where('report.status = :status', { status });
    }

    const [items, total] = await query
      .leftJoinAndSelect('report.user', 'user')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('report.createdAt', 'DESC')
      .getManyAndCount();

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

  async createReport(reportedBy: number, dto: CreateReportDto) {
    const report = this.reportRepository.create({
      ...dto,
      status: 'pending',
    });

    return this.reportRepository.save(report);
  }

  async updateStatus(
    id: number,
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  ) {
    const report = await this.reportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = status;
    return this.reportRepository.save(report);
  }
}