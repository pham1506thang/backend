import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOneOptions } from 'typeorm';
import { BaseRepository } from 'shared-common';
import { Media } from '../entities/media.entity';

@Injectable()
export class MediaRepository extends BaseRepository<Media> {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>
  ) {
    super(mediaRepo);
  }
}
