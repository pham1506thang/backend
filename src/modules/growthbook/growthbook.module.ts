import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GrowthBookService } from './growthbook.service';

@Module({
  imports: [ConfigModule],
  providers: [GrowthBookService],
  exports: [GrowthBookService],
})
export class GrowthBookModule {} 