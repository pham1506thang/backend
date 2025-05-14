import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Domain } from './domain.schema';
import { DomainRepository } from './domain.repository';
import { CreateDomainDTO } from './domain.dto';

@Injectable()
export class DomainService {
  constructor(
    @InjectModel(Domain.name)
    private readonly domainRepository: DomainRepository,
  ) {}

  create(dto: CreateDomainDTO) {
    return this.domainRepository.create(dto);
  }
}
