import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { UserRepository } from './user.repository';
import { GrowthBookModule } from 'modules/growthbook/growthbook.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    GrowthBookModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
