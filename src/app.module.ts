import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ActionModule } from './modules/action/action.module';
import { RoleModule } from './modules/role/role.module';
import { DomainModule } from './modules/domain/domain.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    UserModule,
    ActionModule,
    DomainModule,
  ],
})
export class AppModule {}
