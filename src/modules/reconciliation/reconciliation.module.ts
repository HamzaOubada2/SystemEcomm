import { Module } from '@nestjs/common';
import { ReconciliationController } from './reconciliation.controller';
import { ReconciliationService } from './reconciliation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReconciliationLog } from './entitys/reconciliation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReconciliationLog])],
  controllers: [ReconciliationController],
  providers: [ReconciliationService],
})
export class ReconciliationModule {}
