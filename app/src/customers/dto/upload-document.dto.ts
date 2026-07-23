import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class UploadDocumentDto {
  @ApiProperty({ enum: DocumentType, example: DocumentType.NID, description: 'Type of document (nid, tax_cert, photo, signature)' })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Document file (JPEG, PNG, PDF up to 5MB)' })
  file: any;
}
