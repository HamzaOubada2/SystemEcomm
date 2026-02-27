import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus } from 'src/shared/enum/statusOrder.enum';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'TKR12364', description: 'Unique Tracking Number' })
  trackingNumber?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ example: 150.5, description: 'Order price' })
  price?: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
