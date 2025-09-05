import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { BaseRepository } from 'common/repositories/base.repository';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    repo: Repository<Permission>,
  ) {
    super(repo);
  }

  async findByDomainWithAction(domain: string, action: string) {
    return this.repository.findOneBy({ domain, action });
  }
}
