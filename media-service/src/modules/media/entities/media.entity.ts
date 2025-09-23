import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { MEDIA_FILE_TYPES, MEDIA_CATEGORIES, MEDIA_PROCESSING_STATUS } from '../../../common/constants/image-sizes';
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

  @Column({ type: 'varchar', length: 10 })
  fileExtension: string; // jpg, png, webp, etc.

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

  @Column({ type: 'bigint' })
  size: number; // bytes

  @Column({ type: 'int', nullable: true })
  quality?: number; // image quality (1-100)

  @Column({ type: 'uuid' })
  uploaderId: string; // JWTUser.id

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean; // privacy control

  @Column({ type: 'text', nullable: true })
  altText?: string; // accessibility

  @Column({ type: 'text', nullable: true })
  description?: string; // media description

  @Column({
    type: 'enum',
    enum: Object.values(MEDIA_PROCESSING_STATUS),
    default: MEDIA_PROCESSING_STATUS.COMPLETED,
  })
  processingStatus: typeof MEDIA_PROCESSING_STATUS[keyof typeof MEDIA_PROCESSING_STATUS];

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
