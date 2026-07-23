import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AddressType } from '../enums/address-type.enum';
import { PhoneType } from '../enums/phone-type.enum';
import { IsNotFutureDate } from '../../common/validators/is-not-future-date.validator';

export class CreatePhoneNumberDto {
  @ApiProperty({ example: '01711000001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  number: string;

  @ApiPropertyOptional({ enum: PhoneType, default: PhoneType.PRIMARY })
  @IsOptional()
  @IsEnum(PhoneType)
  type?: PhoneType = PhoneType.PRIMARY;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean = false;
}

export class CreateAddressDto {
  @ApiProperty({ enum: AddressType, example: AddressType.PRESENT })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  line1?: string;

  @ApiPropertyOptional({ example: 'Apartment 4B' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  line2?: string;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Dhaka Division' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: '1207' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zip?: string;

  @ApiPropertyOptional({ example: 'Bangladesh' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nidNumber: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsDateString()
  @IsNotFutureDate()
  dateOfBirth?: string;

  @ApiPropertyOptional({ type: [CreatePhoneNumberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhoneNumberDto)
  phoneNumbers?: CreatePhoneNumberDto[];

  @ApiPropertyOptional({ type: [CreateAddressDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  addresses?: CreateAddressDto[];
}
