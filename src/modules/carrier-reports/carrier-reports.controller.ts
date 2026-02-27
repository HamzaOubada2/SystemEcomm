import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CarrierReportService } from './carrier-reports.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('carrier-reports')
@Controller('carrier-reports')
export class CarrierRaportsController {
  constructor(private readonly carrierReportsService: CarrierReportService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data') //For know Swagger Send file upload type

  //You say to swagger i have field name file
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })

  /* 
    -> Receive file
    -> Set in request.file
    -> convert to Express.Multer.File
  */
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File /* Receive file from request */,
  ) {
    return this.carrierReportsService.processExcel(file);
  }
}
