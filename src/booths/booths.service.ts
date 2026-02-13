import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booth } from 'src/entities/booth.entity';
import { Repository } from 'typeorm';
import { UpdateBoothContentDTO } from './dto/update-booth.dto';
import { CreateBoothContentDTO } from './dto/create-booth-content.dto';

@Injectable()
export class BoothsService {
  constructor(
    @InjectRepository(Booth)
    private boothRepository: Repository<Booth>,
  ) {}

  async getBoothById(boothId: number) {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
      relations: ['expo', 'company'],
    });

    if (!booth) {
      throw new NotFoundException(`Booth with ID ${boothId} not found`);
    }

    await this.boothRepository.save(booth);

    return booth;
  }

  async createBooth(
    expoId: number,
    exhibitorId: number,
    dto: CreateBoothContentDTO,
  ) {
    // Check if user already has a booth for this expo
    const existingBooth = await this.boothRepository.findOne({
      where: { expoId, exhibitorId },
    });

    if (existingBooth) {
      throw new ConflictException('You already have a booth for this expo');
    }

    const booth = this.boothRepository.create({
      ...dto,
      expoId,
      exhibitorId,
      status: 'pending',
    });

    return this.boothRepository.save(booth);
  }

  async getBoothsByExhibitor(exhibitorId: number) {
    return this.boothRepository.find({
      where: { exhibitorId },
      relations: ['expo', 'company'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateBoothByExhibitor(
    boothId: number,
    exhibitorId: number,
    dto: UpdateBoothContentDTO,
  ) {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
    });

    if (!booth) {
      throw new NotFoundException('Booth not found');
    }

    if (booth.exhibitorId !== exhibitorId) {
      throw new ForbiddenException('You can only update your own booths');
    }

    Object.assign(booth, dto);
    return this.boothRepository.save(booth);
  }

  async updateBoothStatus(
    boothId: number,
    organizerId: number,
    status: 'pending' | 'approved' | 'rejected',
  ) {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
      relations: ['expo'],
    });

    if (!booth) {
      throw new NotFoundException('Booth not found');
    }

    if (booth.expo.organizerId !== organizerId) {
      throw new ForbiddenException(
        'You can only approve booths for your own expos',
      );
    }

    booth.status = status;
    return this.boothRepository.save(booth);
  }

  async findAllPaginated(page: number = 1, limit: number = 20) {
    // not optimized, use index instead, for now this should work :)
    const [items, total] = await this.boothRepository.findAndCount({
      relations: ['expo', 'company'],
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

  async updateBooth(id: number, dto: UpdateBoothContentDTO) {
    const booth = await this.getBoothById(id);
    Object.assign(booth, dto);
    return this.boothRepository.save(booth);
  }

  async deleteBooth(id: number) {
    const booth = await this.getBoothById(id);
    await this.boothRepository.remove(booth);
    return { message: 'Booth deleted successfully' };
  }
}
