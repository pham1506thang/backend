import { Body, Controller, Post } from '@nestjs/common';
import { DomainService } from './domain.service';
import { CreateDomainDTO } from './domain.dto';

@Controller('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post()
  create(@Body() body: CreateDomainDTO) {
    return this.domainService.create(body);
  }
}
