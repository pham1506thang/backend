import { Injectable } from '@nestjs/common';
import { CreateActionDTO } from './action.dto';
import { ActionRepository } from './action.repository';

@Injectable()
export class ActionService {
  constructor(private readonly actionRepository: ActionRepository) {}

  create(actionDTO: CreateActionDTO) {
    return this.actionRepository.create(actionDTO);
  }
}
