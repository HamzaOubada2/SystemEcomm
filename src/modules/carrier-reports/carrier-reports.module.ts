import { Module } from '@nestjs/common';
import { CarrierRaportsController } from './carrier-reports.controller';
import { CarrierReportService } from './carrier-reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrierReport } from './entitys/Carrier-raports.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarrierReport])],
  controllers: [CarrierRaportsController],
  providers: [CarrierReportService],
})
export class CarrierReportsModule {}
