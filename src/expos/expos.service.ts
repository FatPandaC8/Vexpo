import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expo } from 'src/entities/expo.entity';
import { Repository } from 'typeorm';
import { UpdateExpoDTO } from './dto/update-expo.dto';
import { CreateExpoDTO } from './dto/create-expo.dto';
import { Booth } from 'src/entities/booth.entity';
import { UpdateBoothContentDTO } from 'src/booths/dto/update-booth.dto';

@Injectable()
export class ExposService {
  constructor(
    @InjectRepository(Expo)
    private expoRepository: Repository<Expo>,
    @InjectRepository(Booth)
    private boothRepository: Repository<Booth>,
  ) {}

  async findAll(filters?: { type?: string }) {
    const query = this.expoRepository.createQueryBuilder('expo');

    if (filters?.type) {
      query.andWhere('expo.type = :type', { type: filters.type });
    }

    return query
      .leftJoinAndSelect('expo.registrations', 'registrations')
      .leftJoinAndSelect('expo.booths', 'booths')
      .orderBy('expo.startDate', 'DESC')
      .getMany();
  }

  async findExpoById(expoId: number) {
    const expo = await this.expoRepository.findOne({
      where: { id: expoId },
      relations: ['registrations', 'booths'],
    });
    if (!expo) throw new NotFoundException(`Expo with ID ${expoId} not found`);

    return expo;
  }

  async findAllBoothByExpoId(expoId: number) {
    // need to make a booth content table
    await this.findExpoById(expoId);

    return this.boothRepository.find({
      where: { 
        expoId,
        status: 'approved'
      },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  async getExposByOrganizer(organizerId: number) {
    return this.expoRepository.find({
      where: { organizerId },
      relations: ['registrations', 'booths'],
      order: { startDate: 'DESC' },
    });
  }

  async createExpo(organizerId: number, dto: CreateExpoDTO) {
    const expo = this.expoRepository.create({
      ...dto,
      organizerId,
    });

    return this.expoRepository.save(expo);
  }

  async updateExpoByOrganizer(
    expoId: number,
    organizerId: number,
    dto: UpdateExpoDTO,
  ) {
    const expo = await this.findExpoById(expoId);

    if (expo.organizerId !== organizerId) {
      throw new ForbiddenException('You can only update your own expos');
    }

    Object.assign(expo, dto); // copy the content of the dto then return it
    return this.expoRepository.save(expo);
  }

  async deleteExpoByOrganizer(expoId: number, organizerId: number) {
    const expo = await this.findExpoById(expoId);

    if (expo.organizerId !== organizerId) {
      throw new ForbiddenException('You can only delete your own expos');
    }

    await this.expoRepository.remove(expo);
    return { message: 'Expo deleted successfully' };
  }

  async getExpoBoothsByOrganizer(expoId: number, organizerId: number) {
    const expo = await this.findExpoById(expoId);

    if (expo.organizerId !== organizerId) {
      throw new ForbiddenException(
        'You can only view booths of your own expos',
      );
    }

    return this.boothRepository.find({
      where: { expoId, status: 'approved' },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  // Admin 
  async updateExpo(id: number, dto: UpdateExpoDTO) {
    const expo = await this.findExpoById(id);
    Object.assign(expo, dto);
    return this.expoRepository.save(expo);
  }

  async deleteExpo(id: number) {
    const expo = await this.findExpoById(id);
    await this.expoRepository.remove(expo);
    return { message: 'Expo deleted successfully' };
  }
}
