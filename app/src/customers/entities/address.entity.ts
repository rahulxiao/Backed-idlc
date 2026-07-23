import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { AddressType } from '../enums/address-type.enum';
import { Customer } from './customer.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.PRESENT,
  })
  type: AddressType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  line1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  line2: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zip: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: 'Bangladesh' })
  country: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
