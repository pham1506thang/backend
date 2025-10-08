import {
  Repository,
  FindOptionsWhere,
  In,
  DeepPartial,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseEntity } from '../interfaces/base-entity.interface';
import { PaginationResult } from '../interfaces/pagination.interface';
import { InfinitePaginationResult } from '../interfaces/cursor.interface';
import {
  applyFilters,
  applySearch,
  applySorts,
  buildPaginationResponse,
} from '../utils/pagination.utils';
import { CursorUtils } from '../utils/cursor.utils';
import { PaginationParamsDto } from '../dto/pagination-params.dto';
import { InfiniteParamsDto } from '../dto/infinite-params.dto';

export class BaseRepository<T extends IBaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async find(filter: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy(filter);
  }

  async findOne(filter: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(filter);
  }

  async findById(id: T['id']): Promise<T | null> {
    return this.findOne({ id } as FindOptionsWhere<T>);
  }

  async findOneWithRelations(
    where: FindOptionsWhere<T>,
    relations: string[] = []
  ): Promise<T | null> {
    return this.repository.findOne({
      where,
      relations,
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
    return this.repository.createQueryBuilder(
      this.repository.metadata.tableName
    );
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

  async findWithInfinitePagination(
    params: InfiniteParamsDto & { searchFields?: string[] },
    queryBuilder?: SelectQueryBuilder<T>
  ): Promise<InfinitePaginationResult<T>> {
    const qb = queryBuilder ?? this.createQueryBuilder();
    const limit = Math.min(params.limit || 20, 100); // Max 100 items

    // Apply filters
    if (params.filters?.length) {
      applyFilters(qb, params.filters);
    }

    // Apply search
    if (params.search) {
      applySearch(qb, params.search, params.searchFields);
    }

    // Apply cursor condition
    if (params.cursor) {
      const cursor = CursorUtils.decode(params.cursor);
      if (cursor) {
        CursorUtils.buildCursorCondition(qb, cursor, params.direction);
      }
    }

    // Apply sorting
    if (params.sorts?.length) {
      applySorts(qb, params.sorts);
    } else {
      // Default sort by createdAt DESC, id ASC for consistent pagination
      qb.orderBy(`${qb.alias}.createdAt`, 'DESC')
        .addOrderBy(`${qb.alias}.id`, 'ASC');
    }

    // Get one extra item to determine if there are more pages
    const items = await qb.take(limit + 1).getMany();
    
    const hasNextPage = items.length > limit;
    const data = hasNextPage ? items.slice(0, limit) : items;
    
    // Generate next/prev cursors
    let nextCursor: string | null = null;
    let prevCursor: string | null = null;
    
    if (data.length > 0) {
      if (hasNextPage) {
        const lastItem = data[data.length - 1];
        const sortFields = params.sorts?.map(s => s.field) || ['createdAt', 'id'];
        const sortOrders = params.sorts?.map(s => s.order === 'ascend' ? 'ASC' : 'DESC') || ['DESC', 'ASC'];
        const nextCursorData = CursorUtils.createFromEntity(lastItem, sortFields, sortOrders);
        nextCursor = CursorUtils.encode(nextCursorData);
      }
      
      if (params.cursor) {
        const firstItem = data[0];
        const sortFields = params.sorts?.map(s => s.field) || ['createdAt', 'id'];
        const sortOrders = params.sorts?.map(s => s.order === 'ascend' ? 'ASC' : 'DESC') || ['DESC', 'ASC'];
        const prevCursorData = CursorUtils.createFromEntity(firstItem, sortFields, sortOrders);
        prevCursor = CursorUtils.encode(prevCursorData);
      }
    }

    return {
      data,
      pagination: {
        hasNextPage,
        hasPrevPage: !!params.cursor,
        nextCursor,
        prevCursor,
        limit
      }
    };
  }
}
