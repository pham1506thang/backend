import {
  Repository,
  FindOptionsWhere,
  In,
  DeepPartial,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseEntity } from 'common/interfaces/base-entity.interface';
import { PaginationResult } from 'common/interfaces/pagination.interface';
import { applyFilters, applySearch, applySorts, buildPaginationResponse } from 'common/utils/pagination.utils';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';

export class BaseRepository<T extends IBaseEntity> {
  constructor(protected readonly repository: Repository<T>) { }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async find(filter: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy(filter);
  }

  async findById(id: T['id']): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async findByIds(ids: T['id'][]): Promise<T[]> {
    return this.repository.find({
      where: { id: In(ids) } as FindOptionsWhere<T>,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  createQueryBuilder(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(this.repository.metadata.tableName)
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  async update(id: T['id'], data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: T['id']): Promise<void> {
    await this.repository.delete(id);
  }

  async softDeleteById(id: T['id']): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findWithPagination(
    params: PaginationParamsDto & { searchFields?: string[] },
    queryBuilder?: SelectQueryBuilder<T>
  ): Promise<PaginationResult<T>> {
    const qb = queryBuilder ?? this.createQueryBuilder();

    if (params.filters?.length) {
      applyFilters(qb, params.filters);
    }

    if (params.search) {
      applySearch(qb, params.search, params.searchFields);
    }

    if (params.sorts?.length) {
      applySorts(qb, params.sorts);
    }

    return buildPaginationResponse(qb, params);
  }

}
