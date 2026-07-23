import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './controllers/customers.controller';
import { Customer } from './entities/customer.entity';
import { PhoneNumber } from './entities/phone-number.entity';
import { Address } from './entities/address.entity';
import { Document } from './entities/document.entity';
import { CustomersRepository } from './repositories/customers.repository';
import { CustomersService } from './services/customers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, PhoneNumber, Address, Document]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRepository],
  exports: [CustomersService],
})
export class CustomersModule {}
