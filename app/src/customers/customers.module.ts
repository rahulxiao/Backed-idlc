import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './controllers/customers.controller';
import { DocumentsController } from './controllers/documents.controller';
import { Customer } from './entities/customer.entity';
import { PhoneNumber } from './entities/phone-number.entity';
import { Address } from './entities/address.entity';
import { Document } from './entities/document.entity';
import { CustomersRepository } from './repositories/customers.repository';
import { DocumentsRepository } from './repositories/documents.repository';
import { CustomersService } from './services/customers.service';
import { DocumentsService } from './services/documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, PhoneNumber, Address, Document]),
  ],
  controllers: [CustomersController, DocumentsController],
  providers: [
    CustomersService,
    CustomersRepository,
    DocumentsService,
    DocumentsRepository,
  ],
  exports: [CustomersService, DocumentsService],
})
export class CustomersModule {}
