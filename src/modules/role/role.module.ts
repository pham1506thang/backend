import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Domain, DomainSchema } from './domain/domain.schema';
import { Action, ActionSchema } from './action/action.schema';
import { ActionService } from './action/action.service';
import { DomainService } from './domain/domain.service';
import { ActionController } from './action/action.controller';
import { DomainController } from './domain/domain.controller';
import { DomainRepository } from './domain/domain.repository';
import { ActionRepository } from './action/action.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Domain.name, schema: DomainSchema }]),
    MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [
    DomainService,
    DomainRepository,
    ActionService,
    ActionRepository,
    RoleService,
  ],
  controllers: [DomainController, ActionController, RoleController],
  exports: [RoleService],
})
export class RoleModule {}
