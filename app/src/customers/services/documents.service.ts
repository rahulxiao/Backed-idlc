import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Document } from '../entities/document.entity';
import { DocumentType } from '../enums/document-type.enum';
import { CustomersRepository } from '../repositories/customers.repository';
import { DocumentsRepository } from '../repositories/documents.repository';

@Injectable()
export class DocumentsService {
  private readonly uploadBaseDir: string;

  constructor(
    private readonly documentsRepository: DocumentsRepository,
    private readonly customersRepository: CustomersRepository,
  ) {
    this.uploadBaseDir = process.env.UPLOAD_DIR || 'uploads/documents';
  }

  async uploadDocument(
    customerId: string,
    type: DocumentType,
    file: Express.Multer.File,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const customerExists = await this.customersRepository.exists(customerId);
    if (!customerExists) {
      // Remove uploaded file if customer doesn't exist
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new NotFoundException(`Customer with id "${customerId}" not found`);
    }

    return this.documentsRepository.create({
      customerId,
      type,
      fileName: file.filename,
      filePath: file.path.replace(/\\/g, '/'),
      fileSize: file.size,
      mimeType: file.mimetype,
    });
  }

  async findByCustomerId(customerId: string): Promise<Document[]> {
    const customerExists = await this.customersRepository.exists(customerId);
    if (!customerExists) {
      throw new NotFoundException(`Customer with id "${customerId}" not found`);
    }
    return this.documentsRepository.findByCustomerId(customerId);
  }

  async getDocumentFile(
    customerId: string,
    docId: string,
  ): Promise<{ doc: Document; absolutePath: string }> {
    const doc = await this.documentsRepository.findByIdAndCustomer(docId, customerId);
    if (!doc) {
      throw new NotFoundException(
        `Document with id "${docId}" for customer "${customerId}" not found`,
      );
    }

    const absolutePath = path.resolve(doc.filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Document file does not exist on disk');
    }

    return { doc, absolutePath };
  }

  async removeDocument(customerId: string, docId: string): Promise<{ message: string }> {
    const doc = await this.documentsRepository.findByIdAndCustomer(docId, customerId);
    if (!doc) {
      throw new NotFoundException(
        `Document with id "${docId}" for customer "${customerId}" not found`,
      );
    }

    // Delete file from filesystem
    const absolutePath = path.resolve(doc.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    // Delete record from DB
    await this.documentsRepository.delete(docId);

    return { message: 'Document deleted successfully' };
  }
}
