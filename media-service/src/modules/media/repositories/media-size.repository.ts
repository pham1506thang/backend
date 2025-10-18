import { Repository } from "typeorm";
import { MediaSize } from "../entities/media-size.entity";
import { BaseRepository } from "shared-common";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MediaSizeRepository extends BaseRepository<MediaSize> {
  constructor(
    @InjectRepository(MediaSize)
    private mediaSizeRepository: Repository<MediaSize>,
  ) {
    super(mediaSizeRepository);
  }
}