import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Action, ActionDocument } from './action.schema';

@Injectable()
export class ActionRepository extends BaseRepository<Action> {
  constructor(
    @InjectModel(Action.name) private actionModel: Model<ActionDocument>,
  ) {
    super(actionModel);
  }
}
