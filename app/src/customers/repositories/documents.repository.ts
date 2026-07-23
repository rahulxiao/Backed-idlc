import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { DocumentType } from '../enums/document-type.enum';

@Injectable()
export class DocumentsRepository {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,
  ) {}

  async create(data: {
    customerId: string;
    type: DocumentType;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
  }): Promise<Document> {
    const doc = this.repo.create(data);
    return this.repo.save(doc);
  }

  async findByCustomerId(customerId: string): Promise<Document[]> {
    return this.repo.find({
      where: { customerId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async findByIdAndCustomer(id: string, customerId: string): Promise<Document | null> {
    return this.repo.findOne({
      where: { id, customerId },
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
