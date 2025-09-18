import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('media_versions')
@Index(['mediaId', 'isCurrent'], { unique: true, where: '"isCurrent" = true' }) // Only one current version per media
export class MediaVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  mediaId: string;

  @Column({ type: 'varchar', length: 20 })
  version: string; // "1.0.0", "1.1.0", etc.

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', length: 500 })
  filePath: string; // relative path on storage

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'boolean', default: false })
  isCurrent: boolean; // only one version can be current

  @Column({ type: 'uuid' })
  createdBy: string; // JWTUser.id

  @Column({ type: 'text', nullable: true })
  changeLog?: string; // what changed in this version

  @CreateDateColumn()
  createdAt: Date;

  // Relationships - will be defined after other entities are created
  // @ManyToOne(() => Media, media => media.versions, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'mediaId' })
  // media: Media;

  // @OneToMany(() => MediaSize, size => size.version)
  // sizes: MediaSize[];
}
