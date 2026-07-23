import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../enums/document-type.enum';

export class DocumentResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  customerId: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.NID })
  type: DocumentType;

  @ApiProperty({ example: '1721742000000-nid.pdf' })
  fileName: string;

  @ApiProperty({ example: 'uploads/documents/123e4567-e89b-12d3-a456-426614174000/1721742000000-nid.pdf' })
  filePath: string;

  @ApiProperty({ example: 1048576 })
  fileSize: number;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: '2026-07-23T14:00:00.000Z' })
  uploadedAt: Date;
}
