import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarrierReport } from './entitys/Carrier-raports.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';

@Injectable()
export class CarrierReportService {
  constructor(
    @InjectRepository(CarrierReport)
    private readonly reportRepository: Repository<CarrierReport>,
  ) {}

  //Receive File from Controller
  async processExcel(file: Express.Multer.File) {
    //If User Not send File -> return 400
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Create Null Object for Contains the Excel Content
    const workbook = new ExcelJS.Workbook();

    //file comme from multer -> ExcelJs Read -> Conver tot structure have (sheets,rows,cells)
    await workbook.xlsx.load(file.buffer.buffer as ArrayBuffer);

    //Get First Sheet In Excel
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new BadRequestException('Worksheet not found');
    }

    //We prepare an Array to stor rows in it before putting them in The database
    const reports: Partial<CarrierReport>[] = [];

    //This function is passed on every line in Excel.
    worksheet.eachRow((row, rowNumber) => {
      //This condition for skip first line because have just Titles: (Tracking, Amount)
      if (rowNumber > 1) {
        reports.push({
          trackingNumber: row.getCell(1).value?.toString(),
          collectedAmount: Number(row.getCell(2).value),
          filename: file.originalname,
        });
        /* 
          tracking Number -> Column A
          collectedAmount -> Column B
          | A     | B   |
          | ----- | --- |
          | TRX01 | 500 |
          | TRX02 | 800 |
        */
      }
    });
    //check if Excel Empty
    if (reports.length === 0) {
      throw new BadRequestException('Excel Error');
    }

    return await this.reportRepository.save(reports);
  }
}

/*
  MAIN IDEA OF THIS CODE:
      -> Receive Excel File from user (using multer)
      -> Read this File using ExcelJs(Librery)
      -> Convert Rows to Object 
      -> Save in database Using TypeORM
      ! Excel -> JSON Object -> Database
*/
