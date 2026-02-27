import { ReconciliationLog } from 'src/modules/reconciliation/entitys/reconciliation.entity';
import { OrderStatus } from 'src/shared/enum/statusOrder.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Hada bach ghadi ndiro Match f Sanne l file Excel
  trackingNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  //precission: 10 number , scale: tow numbers after precission
  price: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => ReconciliationLog, (log) => log.order)
  reconciliationLog: ReconciliationLog;
}
