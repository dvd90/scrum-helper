import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDocumentDto } from './create-product-document.dto';

export class UpdateProductDocumentDto extends PartialType(
  CreateProductDocumentDto,
) {
  jiraSynced?: boolean;
}
