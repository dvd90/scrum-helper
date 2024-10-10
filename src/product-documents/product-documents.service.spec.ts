import { Test, TestingModule } from '@nestjs/testing';
import { ProductDocumentsService } from './product-documents.service';

describe('ProductDocumentsService', () => {
  let service: ProductDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductDocumentsService],
    }).compile();

    service = module.get<ProductDocumentsService>(ProductDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
