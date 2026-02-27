import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/entitys/order.entity';
import { Repository } from 'typeorm';
import { CarrierReport } from '../carrier-reports/entitys/Carrier-raports.entity';
import { ResultType } from 'src/shared/enum/resultType.enum';

@Injectable()
export class ReconciliationService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(CarrierReport)
    private readonly reportRepository: Repository<CarrierReport>,
  ) {}

  async runSysteme() {
    //Get data
    const orders = await this.orderRepository.find();
    const reports = await this.reportRepository.find();

    //Convert Reports Map for fast searching
    const reportsMap = new Map(reports.map((r) => [r.trackingNumber, r]));

    const results = orders.map((order) => {
      const report = reportsMap.get(order.trackingNumber);

      if (!report) {
        return {
          trackingNumber: order.trackingNumber,
          status: ResultType.MISSING,
          message: 'Order not found in carrier report',
        };
      }

      if (Number(order.price) !== Number(report.collectedAmount)) {
        return {
          trackingNumber: order.trackingNumber,
          status: ResultType.MISMATCH,
          diff: Number(order.price) - Number(report.collectedAmount),
        };
      }

      return {
        trackingNumber: order.trackingNumber,
        status: ResultType.MATCHED,
      };
    });
    return results;
  }
}
