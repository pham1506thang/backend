import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Domain, DomainDocument } from './domain.schema';

@Injectable()
export class DomainRepository extends BaseRepository<Domain> {
  constructor(
    @InjectModel(Domain.name) private domainModel: Model<DomainDocument>,
  ) {
    super(domainModel);
  }
}
