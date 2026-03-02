import { Order } from 'src/modules/orders/entitys/order.entity';
import { ResultType } from 'src/shared/enum/resultType.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ReconciliationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (order) => order.reconciliationLog)
  @JoinColumn()
  order: Order;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ type: 'enum', enum: ResultType })
  status: ResultType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  diffAmount: number;

  @Column({ nullable: true })
  message: string;

  @CreateDateColumn()
  processedAt: Date;
}
