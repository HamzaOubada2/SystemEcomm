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

  //Receive File From Multer
  async processExcel(file: Express.Multer.File) {
    //If user not send file -> return 400
    if (!file) {
      throw new BadRequestException('File is required');
    }

    //Create Object in Memory present Excel File
    const workbook = new ExcelJS.Workbook();

    //ExcelJs Read content of file file.buffer & convert Excel to Object Structure
    //!Now Workbook have all sheets
    await workbook.xlsx.load(file.buffer.buffer as ArrayBuffer);

    //Get First Sheet
    const worksheet = workbook.getWorksheet(1);
    //If file have problem or no sheet return error
    if (!worksheet) {
      throw new BadRequestException('Worksheet not found');
    }

    //Create Array  To assemble
    //!we use partial because we dont enter all data of enity example we dont enter id createdAt ...
    const reports: Partial<CarrierReport>[] = [];

    //This Fct applies to evrty row in excel
    worksheet.eachRow((row, rowNumber) => {
      //Skipe first line because just have titles
      if (rowNumber > 1) {
        reports.push({
          trackingNumber: row.getCell(1).value?.toString(),
          collectedAmount: Number(row.getCell(2).value),
          filename: file.originalname,
        });
      }
      /* 
        getCell(1) ==> column A(in excel)
        getCell(2) ==> column B(in excel)

        |TRX01|500|

        {
        trackingNumber: "TRX01",
        collectedAmount: 500,
        filename: "report.xlsx"
        }
      */
    });

    //If Excel Null -> dont make insert
    if (reports.length === 0) {
      throw new BadRequestException('Excel Error');
    }

    return await this.reportRepository.save(reports);
  }
}

/* 
    Role of this code:
        -> Receives File Excel
        -> Read
        -> Extract Data
        -> Convert data to Object
        -> Save in database
*/
