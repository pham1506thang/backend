import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
import { MediaTag } from '../entities/media-tag.entity';
import { MediaSize } from '../entities/media-size.entity';
import { MediaResponseDto } from '../dto';
import { StoragePathUtil } from '../../../common/utils/storage-path.util';

@Injectable()
export class SharedMediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(MediaTag)
    private mediaTagRepository: Repository<MediaTag>,
    @InjectRepository(MediaSize)
    private mediaSizeRepository: Repository<MediaSize>,
  ) {}

  /**
   * Get all available tags across all media
   */
  async getAllTags(): Promise<{ tags: string[] }> {
    const tags = await this.mediaTagRepository
      .createQueryBuilder('tag')
      .select('DISTINCT tag.tagName', 'tagName')
      .getRawMany();

    return {
      tags: tags.map(t => t.tagName),
    };
  }

  /**
   * Get media by tag across all categories
   */
  async getByTag(
    tagName: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .leftJoin('media.tags', 'tag')
      .where('media.isActive = :isActive', { isActive: true })
      .andWhere('tag.tagName = :tagName', { tagName });

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('media.createdAt', 'DESC');

    const [medias, total] = await queryBuilder.getManyAndCount();

    return {
      data: medias.map(media => this.mapToResponseDto(media)),
      total,
    };
  }

  /**
   * Get file URL for any media by ID (cross-category)
   */
  async getFileUrl(id: string, size: string = 'original'): Promise<string> {
    const media = await this.mediaRepository.findOne({
      where: { id, isActive: true },
    });

    if (!media) {
      throw new Error('Media not found');
    }

    if (size === 'original') {
      const category = media.category === 'profile' ? 'profile' : 'images';
      return StoragePathUtil.getRelativeUrlPath(category, id, media.fileName);
    }

    // Get specific size
    const mediaSize = await this.mediaSizeRepository.findOne({
      where: { mediaId: id, sizeName: size },
    });

    if (!mediaSize) {
      throw new Error(`Size ${size} not found for this media`);
    }

    const category = media.category === 'profile' ? 'profile' : 'images';
    return StoragePathUtil.getRelativeUrlPath(category, id, mediaSize.fileName);
  }

  /**
   * Search across all media categories
   */
  async search(
    query: string,
    options: {
      category?: string;
      type?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.isActive = :isActive', { isActive: true })
      .andWhere(
        '(media.originalName ILIKE :query OR media.fileName ILIKE :query OR media.metadata::text ILIKE :query)',
        { query: `%${query}%` }
      );

    // Apply filters
    if (options.category) {
      queryBuilder.andWhere('media.category = :category', { category: options.category });
    }

    if (options.type) {
      queryBuilder.andWhere('media.fileType = :type', { type: options.type });
    }

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('media.createdAt', 'DESC');

    const [medias, total] = await queryBuilder.getManyAndCount();

    return {
      data: medias.map(media => this.mapToResponseDto(media)),
      total,
    };
  }

  /**
   * Filter across all media categories
   */
  async filter(query: any): Promise<{ data: MediaResponseDto[]; total: number }> {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.isActive = :isActive', { isActive: true });

    // Apply filters
    if (query.category) {
      queryBuilder.andWhere('media.category = :category', { category: query.category });
    }

    if (query.fileType) {
      queryBuilder.andWhere('media.fileType = :fileType', { fileType: query.fileType });
    }

    if (query.userId) {
      queryBuilder.andWhere('media.uploaderId = :userId', { userId: query.userId });
    }

    if (query.dateFrom) {
      queryBuilder.andWhere('media.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }

    if (query.dateTo) {
      queryBuilder.andWhere('media.createdAt <= :dateTo', { dateTo: query.dateTo });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(media.originalName ILIKE :search OR media.fileName ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Apply sorting
    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'DESC';
    queryBuilder.orderBy(`media.${sortField}`, sortOrder);

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    const [medias, total] = await queryBuilder.getManyAndCount();

    return {
      data: medias.map(media => this.mapToResponseDto(media)),
      total,
    };
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(media: Media): MediaResponseDto {
    return {
      id: media.id,
      originalName: media.originalName,
      fileName: media.fileName,
      mimeType: media.mimeType,
      fileType: media.fileType,
      category: media.category,
      size: media.size,
      width: media.width,
      height: media.height,
      uploaderId: media.uploaderId,
      isActive: media.isActive,
      metadata: media.metadata,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }
}
