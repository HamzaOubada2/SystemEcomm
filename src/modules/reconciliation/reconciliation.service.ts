import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/entitys/order.entity';
import { Repository } from 'typeorm';
import { CarrierReport } from '../carrier-reports/entitys/Carrier-raports.entity';
import { ResultType } from 'src/shared/enum/resultType.enum';
import { ReconciliationLog } from './entitys/reconciliation.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReconciliationService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(CarrierReport)
    private readonly reportRepository: Repository<CarrierReport>,
    @InjectRepository(ReconciliationLog)
    private readonly logRepository: Repository<ReconciliationLog>,
  ) {}

  async runSysteme() {
    const orders = await this.orderRepository.find();
    const reports = await this.reportRepository.find();

    const reportsMap = new Map(reports.map((r) => [r.trackingNumber, r]));

    const results = orders.map((order) => {
      const report = reportsMap.get(order.trackingNumber);

      if (!report) {
        return {
          order: order,
          trackingNumber: order.trackingNumber,
          status: ResultType.MISSING,
          message: 'Order not found in carrier report',
          diffAmount: Number(order.price),
        };
      }

      if (Number(order.price) !== Number(report.collectedAmount)) {
        return {
          order: order,
          trackingNumber: order.trackingNumber,
          status: ResultType.MISMATCH,
          diffAmount: Number(order.price) - Number(report.collectedAmount),
          message: 'Price mismatch found',
        };
      }

      return {
        order: order,
        trackingNumber: order.trackingNumber,
        status: ResultType.MATCHED,
        diffAmount: 0,
        message: 'All good',
      };
    });

    await this.logRepository.clear();
    await this.logRepository.save(results);
    return results;
  }

  async generateClaimExcel() {
    const logs = await this.logRepository.find({
      where: [{ status: ResultType.MISSING }, { status: ResultType.MISMATCH }],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Claims Report');

    sheet.columns = [
      { header: 'Tracking Number', key: 'trackingNumber', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Amount Difference', key: 'diffAmount', width: 20 },
      { header: 'Message', key: 'message', width: 35 },
    ];

    sheet.addRows(logs);
    return workbook;
  }

  // Summary Dashboard
  async getSummary() {
    const logs = await this.logRepository.find();

    const summary = {
      totalOrder: logs.length,
      matched: logs.filter((l) => l.status === ResultType.MATCHED).length,
      mismatch: logs.filter((l) => l.status === ResultType.MISMATCH).length,
      missing: logs.filter((l) => l.status === ResultType.MISSING).length,

      // Total Money
      totalClaimAmount: logs.reduce(
        (sum, log) => sum + Number(log.diffAmount),
        0,
      ),

      accuracyPercentage:
        logs.length > 0
          ? (
              (logs.filter((l) => l.status === ResultType.MATCHED).length /
                logs.length) *
              100
            ).toFixed(2)
          : 0,
    };
    return summary;
  }
}

/*
  The system make :
    -> Compare with orders from database & Carrier Reports commin from Excel & see if the money matches Or not
*/

/*
    !Explain This Line Of code: const reportsMap = new Map(reports.map((r) => [r.trackingNumber, r]));
    1- We have Array:
      const reports = [
        { trackingNumber: "TRX01", amount: 500 },
        { trackingNumber: "TRX02", amount: 700 },
      ]
    !If we find TRX03: 
    reports.find(r => r.trackingNumber === "TRX03")
    sooo f party Search ghadi dooz 3laa TRX01 & TRX02 & TRX03 image we have 10000 order hhhh The system ghadi iwli Slooow

    !-----------------------------------SOLUTION------------------------------------
    First How Map Work? Imagine i have phone & i want to call Mohcine soo i goo to contacts & search Mohcin(Fast Search)
      -> Map Work LIke this: Key -> Value
    !Example:
    const phoneBook = new Map();

    phoneBook.set("Hamza","0600000000000");
    phoneBook.set("Ali","0719199912282");

    console.log(phoneBook.get("Hamza")); => Result 0600000000000 Fast Searching
  
    !Convert Array to Map:
    BACH NWSLO l had Result: 
      TRX01 → { trackingNumber: "TRX01", amount: 500 }
      TRX02 → { trackingNumber: "TRX02", amount: 700 }
    For Make this reportMap.get("TRX02") O ijib Liya All info of this TRW02

    !-------------------------------Return To Line Of code--------------------------------------
    reports.map((r) => [r.trackingNumber, r]) => Convert Evey Item to [KEY,VALUE]
    Like This: 
        [
        ["TRX01", { trackingNumber: "TRX01", amount: 500 }],
        ["TRX02", { trackingNumber: "TRX02", amount: 700 }],
        ["TRX03", { trackingNumber: "TRX03", amount: 900 }]
        ]
    [trackingNumber, Object]
*/
