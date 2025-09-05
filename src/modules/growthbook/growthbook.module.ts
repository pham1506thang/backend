import { Module } from '@nestjs/common';
import { GrowthBookService } from './growthbook.service';

@Module({
  providers: [GrowthBookService],
  exports: [GrowthBookService],
})
export class GrowthBookModule {}
