import { Module } from '@nestjs/common';
import { ReconciliationController } from './reconciliation.controller';
import { ReconciliationService } from './reconciliation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReconciliationLog } from './entitys/reconciliation.entity';
import { Order } from '../orders/entitys/order.entity';
import { CarrierReport } from '../carrier-reports/entitys/Carrier-raports.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, ReconciliationLog, CarrierReport]),
  ],
  controllers: [ReconciliationController],
  providers: [ReconciliationService],
})
export class ReconciliationModule {}
