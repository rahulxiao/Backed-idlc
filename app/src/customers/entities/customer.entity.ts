import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { CustomerStatus } from '../enums/customer-status.enum';
import { PhoneNumber } from './phone-number.entity';
import { Address } from './address.entity';
import { Document } from './document.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Index()
  @Column({ name: 'nid_number', type: 'varchar', length: 50, unique: true })
  nidNumber: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  status: CustomerStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PhoneNumber, (phone) => phone.customer, {
    cascade: true,
    eager: false,
  })
  phoneNumbers: PhoneNumber[];

  @OneToMany(() => Address, (address) => address.customer, {
    cascade: true,
    eager: false,
  })
  addresses: Address[];

  @OneToMany(() => Document, (doc) => doc.customer, {
    cascade: true,
    eager: false,
  })
  documents: Document[];
}
