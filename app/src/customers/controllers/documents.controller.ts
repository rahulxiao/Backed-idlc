import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  BadRequestException,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentsService } from '../services/documents.service';
import { UploadDocumentDto } from '../dto/upload-document.dto';
import { DocumentResponseDto } from '../dto/document-response.dto';
import { ErrorResponseDto } from '../../common/dto/api-response.dto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@ApiTags('Customer Documents')
@ApiExtraModels(DocumentResponseDto, ErrorResponseDto)
@Controller('customers/:customerId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload document for customer',
    description: 'Uploads a document file (NID, Tax Certificate, Photo, Signature) up to 5MB (JPEG, PNG, PDF).',
  })
  @ApiParam({ name: 'customerId', type: String, description: 'Customer UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadDocumentDto })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully.',
    type: DocumentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or file size exceeds 5MB.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found.',
    type: ErrorResponseDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const customerId = Array.isArray(req.params.customerId)
            ? req.params.customerId[0]
            : req.params.customerId;
          const uploadPath = path.join('uploads', 'documents', customerId);
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `Invalid file type "${file.mimetype}". Allowed types: JPEG, PNG, PDF`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadDocument(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!dto.type) {
      throw new BadRequestException('Document type is required');
    }
    return this.documentsService.uploadDocument(customerId, dto.type, file);
  }

  @Get()
  @ApiOperation({
    summary: 'List customer documents',
    description: 'Retrieve metadata for all documents uploaded for a specific customer.',
  })
  @ApiParam({ name: 'customerId', type: String, description: 'Customer UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Document metadata list retrieved successfully.',
    type: [DocumentResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found.',
    type: ErrorResponseDto,
  })
  findAll(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.documentsService.findByCustomerId(customerId);
  }

  @Get(':docId')
  @ApiOperation({
    summary: 'Download/Stream customer document',
    description: 'Streams binary document file content directly for inline viewing or download.',
  })
  @ApiParam({ name: 'customerId', type: String, description: 'Customer UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiParam({ name: 'docId', type: String, description: 'Document UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Binary file stream.' })
  @ApiResponse({ status: 404, description: 'Document or Customer not found.', type: ErrorResponseDto })
  async downloadDocument(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('docId', ParseUUIDPipe) docId: string,
    @Res() res: Response,
  ) {
    const { doc, absolutePath } = await this.documentsService.getDocumentFile(
      customerId,
      docId,
    );

    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${doc.fileName}"`);
    res.sendFile(absolutePath);
  }

  @Delete(':docId')
  @ApiOperation({
    summary: 'Delete document',
    description: 'Deletes document file from physical storage and removes its metadata from the database.',
  })
  @ApiParam({ name: 'customerId', type: String, description: 'Customer UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiParam({ name: 'docId', type: String, description: 'Document UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Document not found.', type: ErrorResponseDto })
  remove(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('docId', ParseUUIDPipe) docId: string,
  ) {
    return this.documentsService.removeDocument(customerId, docId);
  }
}
