import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarrierReportService } from './carrier-reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadReportDto } from './dtos/upload-report.dto';

@ApiTags('carrier-reports')
@Controller('carrier-reports')
export class CarrierRaportsController {
  constructor(private readonly carrierReportsService: CarrierReportService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data') //For know Swagger receive file upload type
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.carrierReportsService.processExcel(file);
  }
}
/*
    Clinet -> Controller -> Service -> DB
    - PORT /carrier-reports/upload
        ->Interceptor: 
            - Kychoof request
            - if have name file
            - save in memory
            - set request.file
*/
