import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './services/customers.service';
import { CustomersRepository } from './repositories/customers.repository';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PhoneNumber } from './entities/phone-number.entity';
import { Address } from './entities/address.entity';

describe('CustomersService', () => {
  let service: CustomersService;

  const mockCustomersRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    exists: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: CustomersRepository, useValue: mockCustomersRepository },
        { provide: getRepositoryToken(PhoneNumber), useValue: {} },
        { provide: getRepositoryToken(Address), useValue: {} },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
