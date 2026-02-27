import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './modules/orders/orders.module';
import { CarrierReportsModule } from './modules/carrier-reports/carrier-reports.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { Order } from './modules/orders/entitys/order.entity';
import { CarrierReport } from './modules/carrier-reports/entitys/Carrier-raports.entity';
import { ReconciliationLog } from './modules/reconciliation/entitys/reconciliation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [Order, CarrierReport, ReconciliationLog],
        synchronize: true,
      }),
    }),
    OrdersModule,
    CarrierReportsModule,
    ReconciliationModule,
  ],
})
export class AppModule {}
