import {
  Model,
  FilterQuery,
  UpdateQuery,
  Types,
  ProjectionType,
  Document,
} from 'mongoose';
import { BaseSchema } from '../schemas/base.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PaginationResult } from 'common/interfaces/pagination.interface';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';
import { buildPaginationResponse, getMongoQueryFromPaginationParams } from '../utils/pagination.utils';

export abstract class BaseRepository<T extends BaseSchema> {
  constructor(private readonly model: Model<T>) {}

  async create(doc: Partial<T>): Promise<T> {
    try {
      const createdDoc = new this.model(doc);
      return await createdDoc.save();
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new ConflictException(`${field} đã tồn tại.`);
      }
      throw error;
    }
  }

  async validateObjectIds(ids: Types.ObjectId[]) {
    const foundDocs = await this.model
      .find({ _id: { $in: ids } })
      .select('_id')
      .lean()
      .exec();
    const foundIds = new Set(foundDocs.map((doc: any) => doc._id.toString()));

    const invalidIds = ids.filter((id) => !foundIds.has(id));
    if (invalidIds.length > 0) {
      throw new NotFoundException(`_id không hợp lệ: ${invalidIds.join(', ')}`);
    }
  }

  async findById<L extends boolean = true>(
    _id: Types.ObjectId,
    projection: ProjectionType<T> = {},
    includeDeleted = false,
    lean: L = true as L,
  ): Promise<L extends true ? T : Document<T>> {
    const filter: FilterQuery<T> = includeDeleted
      ? { _id }
      : { _id, isDeleted: false };
    const document = await this.model
      .findOne(filter, projection)
      .lean(lean)
      .exec();
    if (!document) {
      throw new NotFoundException(`Document with id ${_id} not found.`);
    }
    return document as unknown as L extends true ? T : Document<T>;
  }

  async findOne<L extends boolean>(
    filter: FilterQuery<T>,
    projection: ProjectionType<T> = {},
    includeDeleted = false,
    lean: L = true as L,
  ): Promise<L extends true ? T : Document<T>> {
    if (!includeDeleted) {
      filter.isDeleted = false;
    }
    const document = await this.model
      .findOne(filter, projection)
      .lean(lean)
      .exec();
    if (!document) {
      throw new NotFoundException(`Document not found.`);
    }
    return document as unknown as L extends true ? T : Document<T>;
  }

  async findAll<L extends boolean>(
    filter: FilterQuery<T> = {},
    projection: ProjectionType<T> = {},
    includeDeleted = false,
    lean: L = true as L,
  ): Promise<(L extends true ? T : Document<T>)[]> {
    if (!includeDeleted) {
      filter.isDeleted = false;
    }
    return this.model
      .find(filter, projection)
      .lean(lean)
      .exec() as unknown as (L extends true ? T : Document<T>)[];
  }

  async updateById(
    _id: Types.ObjectId,
    updateData: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model
      .findByIdAndUpdate(_id, updateData, { new: true })
      .exec();
    if (!document) {
      throw new NotFoundException(
        `Cannot update. Document with id ${_id} not found.`,
      );
    }
    return document;
  }

  async softDeleteById(_id: Types.ObjectId): Promise<T> {
    const document = await this.model
      .findByIdAndUpdate(
        _id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!document) {
      throw new NotFoundException(
        `Cannot soft delete. Document with id ${_id} not found.`,
      );
    }
    return document;
  }

  async restoreById(_id: Types.ObjectId): Promise<T> {
    const document = await this.model
      .findByIdAndUpdate(
        _id,
        { isDeleted: false, deletedAt: null },
        { new: true },
      )
      .exec();
    if (!document) {
      throw new NotFoundException(
        `Cannot restore. Document with id ${_id} not found.`,
      );
    }
    return document;
  }

  async hardDeleteById(_id: Types.ObjectId): Promise<T> {
    const document = await this.model.findByIdAndDelete(_id).exec();
    if (!document) {
      throw new NotFoundException(
        `Cannot hard delete. Document with id ${_id} not found.`,
      );
    }
    return document;
  }

  async paginate<P extends boolean = true, R = P extends true ? T : Document<T>>(
    params: PaginationParamsDto,
    searchFields: string[] = [],
    baseQuery: FilterQuery<T> = {},
    projection: ProjectionType<T> = {},
    includeDeleted = false,
    populate?: string | string[],
    lean: P = true as P,
  ): Promise<PaginationResult<R>> {
    if (!includeDeleted) {
      baseQuery.isDeleted = false;
    }

    const { query: paginationQuery, sort } = getMongoQueryFromPaginationParams(params, searchFields);
    
    // Merge base query with pagination query
    const finalQuery = { ...baseQuery, ...paginationQuery };

    // Get total count for pagination meta
    const total = await this.model.countDocuments(finalQuery);

    // Build the query
    let query = this.model
      .find(finalQuery, projection)
      .sort(sort)
      .skip((params.page - 1) * params.limit)
      .limit(params.limit);

    // Add populate if specified
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(path => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(populate);
      }
    }

    // Execute query with lean option
    const data = await query.lean(lean).exec();

    return buildPaginationResponse(data, total, params) as PaginationResult<R>;
  }
}
