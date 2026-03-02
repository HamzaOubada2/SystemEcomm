import { Controller, Get, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express'; // زدت type هنا باش TypeScript ميبقاش يشكي
import { ReconciliationService } from './reconciliation.service';

@ApiTags('reconciliation')
@Controller('reconciliation')
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Post('run')
  @ApiOperation({ summary: 'Start The reconciliation Process' })
  async run() {
    return this.reconciliationService.runSysteme();
  }

  @Get('download-claims')
  async download(@Res() res: Response) {
    const workbook = await this.reconciliationService.generateClaimExcel();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=claims-report.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get a summary of the last reconciliation' })
  async getSummary() {
    return this.reconciliationService.getSummary();
  }
}
