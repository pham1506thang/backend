import { Body, Controller, Post } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDTO } from './action.dto';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  create(@Body() body: CreateActionDTO) {
    return this.actionService.create(body);
  }
}
