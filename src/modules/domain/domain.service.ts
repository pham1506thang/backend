import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Domain, DomainDocument } from './domain.schema';
import { Model } from 'mongoose';

@Injectable()
export class DomainService {
  constructor(
    @InjectModel(Domain.name)
    private readonly domainModel: Model<DomainDocument>,
  ) {}

  createDomain(domain: { code: string; label: string }) {
    const newDomain = new this.domainModel(domain);
    return newDomain.save();
  }
}
