import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('media_sizes')
@Index(['mediaId', 'versionId', 'sizeName'], { unique: true }) // Unique size per version
export class MediaSize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  mediaId: string;

  @Column({ type: 'uuid' })
  versionId: string;

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

  // Relationships - will be defined after other entities are created
  // @ManyToOne(() => Media, media => media.sizes, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'mediaId' })
  // media: Media;

  // @ManyToOne(() => MediaVersion, version => version.sizes, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'versionId' })
  // version: MediaVersion;
}
