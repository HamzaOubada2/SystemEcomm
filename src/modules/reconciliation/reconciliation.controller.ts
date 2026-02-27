import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
