import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { PhoneNumber } from '../entities/phone-number.entity';
import { Address } from '../entities/address.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { QueryCustomerDto } from '../dto/query-customer.dto';
import { CustomersRepository, PaginatedResult } from '../repositories/customers.repository';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
    @InjectRepository(PhoneNumber)
    private readonly phoneRepo: Repository<PhoneNumber>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create core customer
      const customer = queryRunner.manager.create(Customer, {
        name: dto.name,
        email: dto.email,
        nidNumber: dto.nidNumber,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      });
      const savedCustomer = await queryRunner.manager.save(Customer, customer);

      // Save phone numbers
      if (dto.phoneNumbers && dto.phoneNumbers.length > 0) {
        const phones = dto.phoneNumbers.map((p) =>
          queryRunner.manager.create(PhoneNumber, {
            customerId: savedCustomer.id,
            number: p.number,
            type: p.type,
            isPrimary: p.isPrimary ?? false,
          }),
        );
        await queryRunner.manager.save(PhoneNumber, phones);
      }

      // Save addresses
      if (dto.addresses && dto.addresses.length > 0) {
        const addresses = dto.addresses.map((a) =>
          queryRunner.manager.create(Address, {
            customerId: savedCustomer.id,
            type: a.type,
            line1: a.line1,
            line2: a.line2,
            city: a.city,
            state: a.state,
            zip: a.zip,
            country: a.country,
          }),
        );
        await queryRunner.manager.save(Address, addresses);
      }

      await queryRunner.commitTransaction();

      // Return full customer with relations
      return this.customersRepository.findById(savedCustomer.id) as Promise<Customer>;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id "${id}" not found`);
    }
    return customer;
  }

  async findAll(query: QueryCustomerDto): Promise<PaginatedResult<Customer>> {
    return this.customersRepository.findAll(query);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    // Verify customer exists
    const existing = await this.customersRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Customer with id "${id}" not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update scalar fields
      await queryRunner.manager.update(Customer, id, {
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email }),
        ...(dto.nidNumber && { nidNumber: dto.nidNumber }),
        ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
        ...(dto.status && { status: dto.status }),
      });

      // Replace phone numbers if provided
      if (dto.phoneNumbers !== undefined) {
        await queryRunner.manager.delete(PhoneNumber, { customerId: id });
        if (dto.phoneNumbers.length > 0) {
          const phones = dto.phoneNumbers.map((p) =>
            queryRunner.manager.create(PhoneNumber, {
              customerId: id,
              number: p.number,
              type: p.type,
              isPrimary: p.isPrimary ?? false,
            }),
          );
          await queryRunner.manager.save(PhoneNumber, phones);
        }
      }

      // Replace addresses if provided
      if (dto.addresses !== undefined) {
        await queryRunner.manager.delete(Address, { customerId: id });
        if (dto.addresses.length > 0) {
          const addresses = dto.addresses.map((a) =>
            queryRunner.manager.create(Address, {
              customerId: id,
              type: a.type,
              line1: a.line1,
              line2: a.line2,
              city: a.city,
              state: a.state,
              zip: a.zip,
              country: a.country,
            }),
          );
          await queryRunner.manager.save(Address, addresses);
        }
      }

      await queryRunner.commitTransaction();
      return this.customersRepository.findById(id) as Promise<Customer>;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const existing = await this.customersRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Customer with id "${id}" not found`);
    }
    await this.customersRepository.softDelete(id);
    return { message: `Customer "${existing.name}" has been deactivated successfully` };
  }
}
