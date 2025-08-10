import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import { BaseRepository } from 'common/repositories/base.repository';

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
    });
  }

  async updateLastLoginOnly(id: string): Promise<User | null> {
    await this.userRepo.update(id, { lastLogin: new Date() });
    return this.userRepo.findOne({ where: { id } });
  }
}
