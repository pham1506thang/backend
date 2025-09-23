import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Media } from './media.entity';

@Entity('media_tags')
@Index(['mediaId', 'tagName', 'tagValue'], { unique: true }) // Unique tag per media
export class MediaTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  mediaId: string;

  @Column({ type: 'varchar', length: 100 })
  tagName: string;

  @Column({ type: 'varchar', length: 255 })
  tagValue: string;

  @Column({ type: 'uuid' })
  createdBy: string; // JWTUser.id

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Media, (media) => media.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;
}
