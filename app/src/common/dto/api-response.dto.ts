import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseEnvelopeDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  data: T;

  @ApiPropertyOptional({
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  meta?: Record<string, any>;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Validation failed: Email address already exists' })
  message: string;

  @ApiProperty({ example: 'ConflictException' })
  error: string;

  @ApiProperty({ example: '2026-07-23T20:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/v1/customers' })
  path: string;
}
