import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PrdProcessingService } from 'src/services/prd-processing/prd-processing.service';
import { ProductDocumentsService } from './product-documents.service';
import { CreateProductDocumentDto } from './dto/create-product-document.dto';
import { UpdateProductDocumentDto } from './dto/update-product-document.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';

@Controller('product-documents')
export class ProductDocumentsController {
  constructor(
    private readonly productDocumentService: ProductDocumentsService,
    private readonly prdProcessingService: PrdProcessingService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() createProductDocumentDto: CreateProductDocumentDto,
    @User() user: any,
  ) {
    try {
      const product = await this.productDocumentService.create({
        ...createProductDocumentDto,
        userId: user.userId as string,
      });

      return product;
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle Mongoose validation error
        throw new BadRequestException(error.message);
      }
      // Handle other types of errors
      throw error;
    }
  }

  @Get()
  findAll(@User() userReq: any) {
    return this.productDocumentService.findAll(userReq.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDocumentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDocumentDto: UpdateProductDocumentDto,
  ) {
    return this.productDocumentService.update(id, updateProductDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDocumentService.remove(id);
  }

  @Post(':id/process')
  async processPrdAndCreateTickets(
    @Param('id') id: string,
    @Query('toSync') toSync: string,
    @User() userReq: any,
  ) {
    try {
      const toSyncFlag =
        (toSync || '').toString() === 'false' ? false : undefined;

      const user = await this.usersService.findOne(userReq.userId);
      if (!user.openAIKey || !user.jiraApiKey || !user.jiraDomain) {
        throw new BadRequestException(
          'Please make sure you have a the required configuration',
        );
      }
      const productDocument = await this.productDocumentService.findOne(id);

      if (productDocument.jiraSynced) {
        return { message: 'productDocument was already processed' };
      }

      const config = {
        openAIKey: user.openAIKey,
        jiraDomain: user.jiraDomain,
        jiraEmail: user.jiraEmail || user.email,
        jiraApiKey: user.jiraApiKey,
      };

      const createdTickets =
        await this.prdProcessingService.processPrdAndCreateTickets(
          config,
          productDocument,
          toSyncFlag,
        );

      // Update the product document with the created tickets
      await this.productDocumentService.update(id, {
        jiraSynced: toSyncFlag === false ? false : true,
      });

      return createdTickets;
    } catch (error) {
      console.log(error.name);
      if (error.name === 'CastError') {
        // Handle Mongoose validation error
        throw new NotFoundException('Not Found with ID: ' + id);
      }
      // Handle other types of errors
      throw error;
    }
  }
}
