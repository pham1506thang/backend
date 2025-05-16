import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from 'modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { RoleRepository } from 'modules/role/role.repository';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const roleRepository = app.get(RoleRepository);
  const userService = app.get(UserService);
  const configService = app.get(ConfigService);

  try {
    // Create admin role
    const adminRole = await roleRepository.create({
      code: 'super_admin',
      label: 'Super Administrator',
      isAdmin: true, // This will grant all permissions
      isProtected: true, // This will prevent the role from being deleted, updated
      permissions: [] // Empty permissions since isAdmin=true grants all access
    });

    // Create admin user
    const adminUser = await userService.createUser(
      configService.getOrThrow<string>('ADMIN_USERNAME'),
      configService.getOrThrow<string>('ADMIN_PASSWORD'),
      [adminRole._id as unknown as Types.ObjectId]
    );

    console.log('✅ Admin role and user created successfully');
    console.log('Admin Role ID:', adminRole._id);
    console.log('Admin User ID:', adminUser._id);
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap(); 