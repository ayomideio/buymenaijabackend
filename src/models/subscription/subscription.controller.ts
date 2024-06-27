import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { FileUpload } from 'src/common/decorators/file-upload.decorator';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import {  CreateSubscriptionDto } from './dto/create-subscription.dto';
import { FindSubscriptionsDto } from './dto/find-subscription.dto';
import { UpdateSubscriptionDto} from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';

import { S3Upload } from 'src/util/s3-uploader';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';




/** Exposes product CRUD endpoints */
@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  /** Exposes product CRUD endpoints
   *
   * Instantiate class and subscriptionService dependency
   */
  constructor(private readonly subscriptionService: SubscriptionService,
private readonly s3Upload:S3Upload

  ) {}







  @ApiOperation({ summary: 'Create a new subscription' })
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        plan: { type: 'string', enum: ['BASIC', 'STANDARD', 'PREMIUM'] },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'CANCELED'] },
      },
    },
  })
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto
  ): Promise<Subscription> {
    return this.subscriptionService.create(createSubscriptionDto);
  }


  /** Returns all products with pagination
   *
   * Default is starting on page 1 showing 10 results per page,
   * searching and ordering by name
   */
  @ApiOperation({ summary: 'Returns all subscriptions' })
  @Public()
  @Get()
  findAll(@Query() findSubscriptionsDto: FindSubscriptionsDto): Promise<Subscription[]> {
    return this.subscriptionService.findAll(findSubscriptionsDto);
  }

  /** Find product by ID, only for admins */
  @ApiOperation({ summary: 'Admin gets product by ID' })
  @Public()
  @Get('/id/:id')
  findOneById(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionService.findOneById(id);
  }



  
}
