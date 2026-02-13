import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expo } from 'src/entities/expo.entity';
import { Repository } from 'typeorm';
import { UpdateExpoDTO } from './dto/update-expo.dto';
import { CreateExpoDTO } from './dto/create-expo.dto';
import { Booth } from 'src/entities/booth.entity';
import { UpdateBoothDTO } from 'src/booths/dto/update-booth.dto';

@Injectable()
export class ExposService {
  constructor(
    @InjectRepository(Expo)
    private expoRepository: Repository<Expo>,
    @InjectRepository(Booth)
    private boothRepository: Repository<Booth>,
  ) {}

  async findAll() {
    return this.expoRepository.find({
      relations: [
        'registrations',
        'registrations.expo',
        'booths',
        'booths.expo',
      ],
    });
  }

  async findExpoById(expoId: number) {
    const expo = await this.expoRepository.findOne({
      where: {id: expoId},
      relations: ['registrations', 'booths'],
    });
    if (!expo) throw new NotFoundException(`Expo with ID ${expoId} not found`);

    return expo;
  }

  async findAllBoothByExpoId(expoId: number) {
    // need to make a booth content table
    await this.findExpoById(expoId);
    
    return this.expoRepository.find({
      where: {
        id: expoId,
      },
      relations: ['booths'],
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
    dto: UpdateExpoDTO
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
      throw new ForbiddenException('You can only view booths of your own expos');
    }

    return this.boothRepository.find({
      where: { expoId },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrganizerStats(organizerId: number) {
    const expos = await this.expoRepository.find({
      where: { organizerId },
      relations: ['booths', 'registrations'],
    });

    const totalExpos = expos.length;
    const totalBooths = expos.reduce((sum, expo) => sum + expo.booths.length, 0);
    const totalRegistrations = expos.reduce(
      (sum, expo) => sum + expo.registrations.length, 
      0
    );

    const upcomingExpos = expos.filter(
      expo => new Date(expo.startDate) > new Date()
    ).length;

    const ongoingExpos = expos.filter(expo => {
      const now = new Date();
      return new Date(expo.startDate) <= now && new Date(expo.endDate) >= now;
    }).length;

    return {
      totalExpos,
      upcomingExpos,
      ongoingExpos,
      totalBooths,
      totalRegistrations,
      expos: expos.map(e => ({
        id: e.id,
        name: e.name,
        startDate: e.startDate,
        endDate: e.endDate,
        boothCount: e.booths.length,
        registrationCount: e.registrations.length,
      })),
    };
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

  async updateBooth(id: number, dto: UpdateBoothDTO) {
    // const booth = await this.getBoothById(id);
    // Object.assign(booth, dto);
    // return this.boothRepository.save(booth);
  }

  async deleteBooth(id: number) {
    // const booth = await this.getBoothById(id);
    // await this.boothRepository.remove(booth);
    // return { message: 'Booth deleted successfully' };
  }
}
