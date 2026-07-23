import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { QueryCustomerDto } from '../dto/query-customer.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  async create(data: Partial<Customer>): Promise<Customer> {
    const customer = this.repo.create(data);
    return this.repo.save(customer);
  }

  async findById(id: string): Promise<Customer | null> {
    return this.repo.findOne({
      where: { id },
      relations: { phoneNumbers: true, addresses: true, documents: true },
    });
  }

  async findAll(query: QueryCustomerDto): Promise<PaginatedResult<Customer>> {
    const { page, limit, skip, search, status, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const qb = this.repo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.phoneNumbers', 'phoneNumbers')
      .leftJoinAndSelect('customer.addresses', 'addresses')
      .leftJoinAndSelect('customer.documents', 'documents');

    if (search) {
      qb.andWhere('LOWER(customer.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (status) {
      qb.andWhere('customer.status = :status', { status });
    }

    // Allowlist sortBy to prevent SQL injection
    const allowedSortFields: Record<string, string> = {
      name: 'customer.name',
      email: 'customer.email',
      createdAt: 'customer.createdAt',
      updatedAt: 'customer.updatedAt',
      status: 'customer.status',
    };
    const orderField = allowedSortFields[sortBy] || 'customer.createdAt';
    qb.orderBy(orderField, sortOrder);

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<Customer>;
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.update(id, { status: 'inactive' as any });
  }

  async exists(id: string): Promise<boolean> {
    return this.repo.existsBy({ id });
  }
}
