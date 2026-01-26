import { Module } from '@nestjs/common';
import { ValuationModule } from '../valuation/valuation.module';

@Module({
  imports: [ValuationModule],
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
