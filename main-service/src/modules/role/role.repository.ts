import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import {
  BaseRepository,
  PaginationParamsDto,
  PaginationResult,
} from 'shared-common';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    @InjectRepository(Role)
    repo: Repository<Role>
  ) {
    super(repo);
  }

  async findById(id: string): Promise<Role | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async findWithPagination(
    params: PaginationParamsDto & { searchFields?: string[] }
  ): Promise<PaginationResult<Role>> {
    const qb = this.createQueryBuilder();
    qb.leftJoinAndSelect(`${qb.alias}.permissions`, 'permissions');
    return super.findWithPagination(params, qb);
  }
}
