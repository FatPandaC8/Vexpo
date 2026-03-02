import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booth } from 'src/entities/booth.entity';
import { Repository } from 'typeorm';
import { UpdateBoothDTO } from './dto/update-booth.dto';
import { CreateBoothContentDTO } from './dto/create-booth-content.dto';

@Injectable()
export class BoothsService {
  constructor(
    @InjectRepository(Booth)
    private boothRepository: Repository<Booth>,
  ) {}

  async getBoothById(boothId: string) {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
      relations: ['expo', 'company'],
    });
    if (!booth) {
      throw new NotFoundException(`Booth with ID ${boothId} not found`);
    }
    return booth;
  }

  async createBooth(
    expoId: string,
    exhibitorId: string,
    dto: CreateBoothContentDTO,
  ) {
    // One booth per exhibitor per expo
    const existing = await this.boothRepository.findOne({
      where: { expoId, exhibitorId },
    });
    if (existing) {
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

  async getBoothsByExhibitor(exhibitorId: string) {
    return this.boothRepository.find({
      where: { exhibitorId },
      relations: ['expo', 'company'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateBoothByExhibitor(
    boothId: string,
    exhibitorId: string,
    dto: UpdateBoothDTO,
  ) {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
    });
    if (!booth) throw new NotFoundException('Booth not found');
    if (booth.exhibitorId !== exhibitorId) {
      throw new ForbiddenException('You can only update your own booths');
    }
    Object.assign(booth, dto);
    return this.boothRepository.save(booth);
  }

  async deleteBoothByExhibitor(boothId: string, exhibitorId: string) {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
    });
    if (!booth) throw new NotFoundException('Booth not found');
    if (booth.exhibitorId !== exhibitorId) {
      throw new ForbiddenException('You can only delete your own booths');
    }
    await this.boothRepository.remove(booth);
    return { message: 'Booth deleted successfully' };
  }

  async findAllPaginated(page: number = 1, limit: number = 20) {
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

  async updateBooth(id: string, dto: UpdateBoothDTO) {
    const booth = await this.getBoothById(id);
    Object.assign(booth, dto);
    return this.boothRepository.save(booth);
  }

  async deleteBooth(id: string) {
    const booth = await this.getBoothById(id);
    await this.boothRepository.remove(booth);
    return { message: 'Booth deleted successfully' };
  }
}
