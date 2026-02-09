import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expo } from 'src/entities/expo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExposService {
  constructor(
    @InjectRepository(Expo)
    private expoRepository: Repository<Expo>,
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
    return this.expoRepository.findOneBy({ id: expoId });
  }

  async findAllBoothByExpoId(expoId: number) {
    // need to make a booth content table
    return this.expoRepository.find({
      where: {
        id: expoId,
      },
      relations: ['booths'],
    });
  }
}
