import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserMessageController } from './user-message.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { RoleModule } from '../role/role.module';
import { UserPermissionGatewayModule } from 'shared-common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    RoleModule,
    UserPermissionGatewayModule,
  ],
  controllers: [UserController, UserMessageController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
