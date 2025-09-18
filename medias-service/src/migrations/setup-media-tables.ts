import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Create media-related tables
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_size BIGINT NOT NULL,
        file_path TEXT NOT NULL,
        file_extension VARCHAR(10) NOT NULL,
        processing_status VARCHAR(20) DEFAULT 'pending',
        metadata JSONB,
        user_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP NULL
      );
    `);

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS media_version (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
        version VARCHAR(20) NOT NULL,
        is_current BOOLEAN DEFAULT FALSE,
        file_path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS media_size (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
        size VARCHAR(20) NOT NULL,
        file_path TEXT NOT NULL,
        width INTEGER,
        height INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS media_tag (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS media_tags_media (
        media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
        media_tag_id UUID NOT NULL REFERENCES media_tag(id) ON DELETE CASCADE,
        PRIMARY KEY (media_id, media_tag_id)
      );
    `);

    // Create indexes
    await dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_media_user_id ON media(user_id);
    `);

    await dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_media_processing_status ON media(processing_status);
    `);

    await dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);
    `);

    await dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_media_version_media_id ON media_version(media_id);
    `);

    await dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_media_size_media_id ON media_size(media_id);
    `);

    console.log('✅ Media tables created successfully');
  } catch (error) {
    console.error('❌ Error creating media tables:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
