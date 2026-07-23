import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerStatus } from '../enums/customer-status.enum';

export class PhoneNumberResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '01711000001' })
  number: string;

  @ApiProperty({ example: 'primary' })
  type: string;

  @ApiProperty({ example: true })
  isPrimary: boolean;
}

export class AddressResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'present' })
  type: string;

  @ApiPropertyOptional({ example: '123 Main Street' })
  line1?: string;

  @ApiPropertyOptional({ example: 'Apartment 4B' })
  line2?: string;

  @ApiPropertyOptional({ example: 'Dhaka' })
  city?: string;

  @ApiPropertyOptional({ example: 'Dhaka Division' })
  state?: string;

  @ApiPropertyOptional({ example: '1207' })
  zip?: string;

  @ApiPropertyOptional({ example: 'Bangladesh' })
  country?: string;
}

export class CustomerResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '1234567890' })
  nidNumber: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  dateOfBirth?: Date;

  @ApiProperty({ enum: CustomerStatus, example: CustomerStatus.ACTIVE })
  status: CustomerStatus;

  @ApiProperty({ example: '2026-07-23T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-23T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: [PhoneNumberResponseDto] })
  phoneNumbers: PhoneNumberResponseDto[];

  @ApiProperty({ type: [AddressResponseDto] })
  addresses: AddressResponseDto[];
}
