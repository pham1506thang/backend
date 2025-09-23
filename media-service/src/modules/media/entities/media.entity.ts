import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { MEDIA_FILE_TYPES, MEDIA_CATEGORIES } from '../../../common/constants/image-sizes';
import { MediaSize } from './media-size.entity';
import { MediaTag } from './media-tag.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  fileName: string; // unique filename on storage

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({
    type: 'enum',
    enum: Object.values(MEDIA_FILE_TYPES),
  })
  fileType: typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES]; // focus on image first

  @Column({
    type: 'enum',
    enum: Object.values(MEDIA_CATEGORIES),
    default: MEDIA_CATEGORIES.GENERAL,
  })
  category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES]; // general for images/, profile for profile/

  @Column({ type: 'varchar', length: 500 })
  filePath: string; // full path to file on storage

  @Column({ type: 'bigint' })
  size: number; // bytes

  @Column({ type: 'int', nullable: true })
  width?: number; // for images

  @Column({ type: 'int', nullable: true })
  height?: number; // for images

  @Column({ type: 'uuid' })
  uploaderId: string; // JWTUser.id

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>; // flexible metadata storage

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Relationships
  @OneToMany(() => MediaSize, (size) => size.media, { cascade: true })
  sizes: MediaSize[];

  @OneToMany(() => MediaTag, (tag) => tag.media, { cascade: true })
  tags: MediaTag[];
}
