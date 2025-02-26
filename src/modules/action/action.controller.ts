import { Body, Controller, Post } from '@nestjs/common';
import { ActionService } from './action.service';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  createAction(@Body() body: { code: string; label: string }) {
    return this.actionService.createAction(body);
  }
}
