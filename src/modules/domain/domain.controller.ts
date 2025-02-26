import { Body, Controller, Post } from '@nestjs/common';
import { DomainService } from './domain.service';

@Controller('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post()
  createDomain(@Body() body: { code: string; label: string }) {
    return this.domainService.createDomain(body);
  }
}
