import { Test, TestingModule } from '@nestjs/testing';
import { ProductDocumentsController } from './product-documents.controller';
import { ProductDocumentsService } from './product-documents.service';

describe('ProductDocumentsController', () => {
  let controller: ProductDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductDocumentsController],
      providers: [ProductDocumentsService],
    }).compile();

    controller = module.get<ProductDocumentsController>(
      ProductDocumentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
