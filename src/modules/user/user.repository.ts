import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BaseRepository } from 'common/repositories/base.repository';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';
import { PaginationResult } from 'common/interfaces/pagination.interface';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(userRepo)
  }

  async findByUsername(username: string, includeDeleted = false): Promise<User | null> {
    return this.userRepo.findOne({
      where: { username, isDeleted: includeDeleted ? undefined : false },
      relations: ['roles'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findWithPagination(
    params: PaginationParamsDto & { searchFields?: string[] }
  ): Promise<PaginationResult<User>> {
    const qb = this.createQueryBuilder();
    
    // Add relations
    qb.leftJoinAndSelect(`${qb.alias}.roles`, 'roles');

    return super.findWithPagination(params, qb);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: ['roles'],
    });
  }

  async find(filter: any): Promise<User[]> {
    return this.userRepo.find({
      where: filter,
      relations: ['roles'],
    });
  }

  async findByIds(ids: string[]): Promise<User[]> {
    return this.userRepo.find({
      where: { id: ids } as any,
      relations: ['roles'],
    });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.userRepo.save(data);
  }

  async save(entity: Partial<User>): Promise<User> {
    return this.userRepo.save(entity);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepo.update(id, { lastLogin: new Date() });
  }
}
