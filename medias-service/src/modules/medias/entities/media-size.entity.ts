import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Media } from './media.entity';

@Entity('media_sizes')
@Index(['mediaId', 'sizeName'], { unique: true }) // Unique size per media
export class MediaSize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  mediaId: string;

  @Column({ type: 'varchar', length: 50 })
  sizeName: string; // 'thumbnail', 'small', 'medium', 'large', 'original'

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', length: 500 })
  filePath: string;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'int', nullable: true })
  quality?: number; // for compressed versions

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Media, (media) => media.sizes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;
}
