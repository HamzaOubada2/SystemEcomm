import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('carrierReports')
export class CarrierReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trackingNumber: string; //Number liii jaa f excel

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  collectedAmount: number; // Price li 3nd delivery

  @Column()
  filename: string; // For know mnin jat data ina file

  @CreateDateColumn()
  uploadedAt: Date;
}
