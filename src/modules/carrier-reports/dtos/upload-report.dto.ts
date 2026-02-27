import { ApiProperty } from '@nestjs/swagger';

export class UploadReportDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
