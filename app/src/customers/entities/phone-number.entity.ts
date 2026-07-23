import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { PhoneType } from '../enums/phone-type.enum';
import { Customer } from './customer.entity';

@Entity('phone_numbers')
export class PhoneNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.phoneNumbers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Index()
  @Column({ type: 'varchar', length: 20, unique: true })
  number: string;

  @Column({
    type: 'enum',
    enum: PhoneType,
    default: PhoneType.PRIMARY,
  })
  type: PhoneType;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
