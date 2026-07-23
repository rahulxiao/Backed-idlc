import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CustomerStatus } from '../enums/customer-status.enum';

export class QueryCustomerDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by customer name (partial match)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CustomerStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    default: 'createdAt',
    enum: ['name', 'email', 'createdAt', 'updatedAt', 'status'],
  })
  @IsOptional()
  @IsIn(['name', 'email', 'createdAt', 'updatedAt', 'status'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
