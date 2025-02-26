import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Action, ActionSchema } from './action.schema';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
  ],
  controllers: [ActionController],
  providers: [ActionService]
})
export class ActionModule {}
