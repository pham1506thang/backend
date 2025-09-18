import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('medias')
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
    enum: ['image', 'audio', 'video', 'document', 'other'],
  })
  fileType: 'image' | 'audio' | 'video' | 'document' | 'other';

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

  // Relationships - will be defined after other entities are created
  // @OneToMany(() => MediaVersion, (version) => version.media)
  // versions: MediaVersion[];

  // @OneToMany(() => MediaSize, (size) => size.media)
  // sizes: MediaSize[];

  // @OneToMany(() => MediaTag, (tag) => tag.media)
  // tags: MediaTag[];
}
