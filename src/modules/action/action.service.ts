import { Injectable } from '@nestjs/common';
import { Action, ActionDocument } from './action.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name) private actionModel: Model<ActionDocument>,
  ) {}

  createAction(action: { code: string; label: string }) {
    const newAction = new this.actionModel(action);
    return newAction.save();
  }
}
