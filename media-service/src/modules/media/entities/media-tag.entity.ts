import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Media } from './media.entity';
import { BaseEntity } from 'shared-common';

@Entity('media_tags')
@Index(['mediaId', 'tagName', 'tagValue'], { unique: true }) // Unique tag per media
export class MediaTag extends BaseEntity {
  @Column({ type: 'uuid' })
  mediaId: string;

  @Column({ type: 'varchar', length: 100 })
  tagName: string;

  @Column({ type: 'varchar', length: 255 })
  tagValue: string;

  @Column({ type: 'uuid' })
  createdBy: string; // JWTUser.id

  // Relationships
  @ManyToOne(() => Media, (media) => media.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;
}
