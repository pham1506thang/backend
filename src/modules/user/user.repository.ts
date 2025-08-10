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

  private removePassword(user: User): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  private removePasswords(users: User[]): User[] {
    return users.map(user => this.removePassword(user) as User);
  }

  async findByUsername(username: string, includeDeleted = false): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { username, isDeleted: includeDeleted ? undefined : false },
      relations: ['roles'],
    });
    return user ? this.removePassword(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
    return user ? this.removePassword(user) : null;
  }

  async findWithPagination(
    params: PaginationParamsDto & { searchFields?: string[] }
  ): Promise<PaginationResult<User>> {
    const qb = this.createQueryBuilder();
    
    // Add relations
    qb.leftJoinAndSelect(`${qb.alias}.roles`, 'roles');

    const result = await super.findWithPagination(params, qb)
    
    // Remove passwords from paginated results
    result.data = this.removePasswords(result.data);
    
    return result;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.find({
      relations: ['roles'],
    });
    return this.removePasswords(users);
  }

  async find(filter: any): Promise<User[]> {
    const users = await this.userRepo.find({
      where: filter,
      relations: ['roles'],
    });
    return this.removePasswords(users);
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const users = await this.userRepo.find({
      where: { id: ids } as any,
      relations: ['roles'],
    });
    return this.removePasswords(users);
  }

  async create(data: Partial<User>): Promise<User> {
    const user = await this.userRepo.save(data);
    return this.removePassword(user) as User;
  }

  async save(entity: Partial<User>): Promise<User> {
    const user = await this.userRepo.save(entity);
    return this.removePassword(user) as User;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepo.update(id, { lastLogin: new Date() });
  }
}
