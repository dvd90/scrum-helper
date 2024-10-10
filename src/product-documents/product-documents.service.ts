import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product-document.schema';
import { CreateProductDocumentDto } from './dto/create-product-document.dto';
import { UpdateProductDocumentDto } from './dto/update-product-document.dto';
import { Task } from './schemas/task.schema';

@Injectable()
export class ProductDocumentsService {
  constructor(
    @InjectModel(ProductDocument.name)
    private productDocumentModel: Model<ProductDocument>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async create(
    createProductDocumentDto: CreateProductDocumentDto,
  ): Promise<ProductDocument> {
    const createdProductDocument = new this.productDocumentModel(
      createProductDocumentDto,
    );
    return createdProductDocument.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productDocumentModel.find().exec();
  }

  async findOne(id: string): Promise<ProductDocument & { tasks: Task[] }> {
    const productDocument = await this.productDocumentModel.findById(id).exec();
    if (!productDocument) {
      throw new Error('ProductDocument not found');
    }

    const tasks = await this.taskModel.find({ productDocumentId: id }).exec();

    // Convert to a plain JavaScript object so we can add the tasks
    const productDocumentObj: ProductDocument & { tasks: Task[] } =
      productDocument.toObject() as ProductDocument & { tasks: Task[] };
    productDocumentObj.tasks = tasks;

    return productDocumentObj;
  }

  async update(
    id: string,
    updateProductDocumentDto: UpdateProductDocumentDto,
  ): Promise<ProductDocument> {
    return this.productDocumentModel
      .findByIdAndUpdate(id, updateProductDocumentDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ProductDocument> {
    return this.productDocumentModel.findByIdAndDelete(id).exec();
  }
}
