import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booth } from 'src/entities/booth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoothsService {
  constructor(
    @InjectRepository(Booth)
    private boothRepository: Repository<Booth>,
  ) {}

  async getBoothById(boothId: number) {
    return this.boothRepository.findOneBy({
      id: boothId,
    });
  }
}
