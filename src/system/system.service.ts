import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/entities/log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async createLog(data: {
    userId?: number;
    action: string;
    resource?: string;
    resourceId?: number;
    metadata?: any;
    ipAddress?: string;
  }) {
    const log = this.logRepository.create(data);
    return this.logRepository.save(log);
  }

  async getLogs(filters: {
    page: number;
    limit: number;
    action?: string;
    userId?: number;
  }) {
    const { page, limit, action, userId } = filters;
    const query = this.logRepository.createQueryBuilder('log');

    if (action) {
      query.where('log.action = :action', { action });
    }

    if (userId) {
      query.andWhere('log.userId = :userId', { userId });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('log.createdAt', 'DESC')
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
}