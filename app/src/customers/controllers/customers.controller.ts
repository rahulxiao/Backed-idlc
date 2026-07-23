import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { QueryCustomerDto } from '../dto/query-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { ErrorResponseDto } from '../../common/dto/api-response.dto';
import { CustomersService } from '../services/customers.service';

@ApiTags('Customers')
@ApiExtraModels(CustomerResponseDto, ErrorResponseDto)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new customer',
    description: 'Scaffolds a new customer record along with optional phone numbers and addresses in a database transaction.',
  })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully.',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (e.g. invalid email format, future DOB).',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict — Duplicate Email, Mobile Number, or National ID.',
    type: ErrorResponseDto,
  })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginated list of customers',
    description: 'Retrieve customers with support for pagination (`page`, `limit`), sorting (`sortBy`, `sortOrder`), search by name, and filter by status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Customers list retrieved successfully with pagination meta.',
    type: [CustomerResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters.',
    type: ErrorResponseDto,
  })
  findAll(@Query() query: QueryCustomerDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get customer by UUID',
    description: 'Fetch detailed customer profile including associated phone numbers, addresses, and uploaded document metadata.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Customer UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Customer details retrieved successfully.',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found with given ID.',
    type: ErrorResponseDto,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update customer details',
    description: 'Partially update customer profile properties, phone numbers, addresses, or status.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Customer UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully.',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error on update payload.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict — Duplicate Email, Mobile Number, or NID.',
    type: ErrorResponseDto,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete customer',
    description: 'Marks customer status as `inactive` without permanently deleting records to preserve historical integrity.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Customer UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Customer marked as inactive successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found.',
    type: ErrorResponseDto,
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
