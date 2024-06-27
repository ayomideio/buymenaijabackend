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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { FileUpload } from 'src/common/decorators/file-upload.decorator';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { File } from './types/file';
import { S3Upload } from 'src/util/s3-uploader';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';



var storag = {
  storage: multer.diskStorage({
    destination: (req: Express.Request, file, cb) => {
      cb(null, `./uploads/`);
    },
    filename: (req: Express.Request, file, cb) => {
      if (file) {
        const extension: string = extname(file.originalname);
        const filename: string = uuid();

        cb(null, `${filename}${extension}`);
      }
    },
  }),
};

/** Exposes product CRUD endpoints */
@ApiTags('product')
@Controller('product')
export class ProductController {
  /** Exposes product CRUD endpoints
   *
   * Instantiate class and ProductService dependency
   */
  constructor(private readonly productService: ProductService,
private readonly s3Upload:S3Upload

  ) {}


  /** Endpoint to upload a file and return its URL */
  @ApiOperation({ summary: 'Uploads a file and returns its URL' })
  @Public()  // You can make this endpoint public if needed
  @Post('uploadimage')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage()
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File


): Promise<{ fileUrl: string }> {
    console.log(`file ${JSON.stringify(file.buffer)}`);
    const uploadResult = await this.s3Upload.uploadFile(file.buffer, file.originalname);
    return { fileUrl: uploadResult.fileUrl };
  }





/** Endpoint to upload multiple files and return their URLs */
@ApiOperation({ summary: 'Uploads multiple files and returns their URLs' })
@Public()  // You can make this endpoint public if needed
@Post('upload-multiple')
@UseInterceptors(FilesInterceptor('file', 10)) // 10 is the maximum number of files
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        items: { type: 'file' }
      }
    }
  }
})


async uploadMultipleFiles(@UploadedFiles() file: Array<Express.Multer.File>,

@Req() req: any,
@Res() res:Response,
): Promise<{ fileUrls: string[] }> {
  
  const fileUrls = [];
  console.log(`file ${JSON.stringify(file)}`);
  for (const fil of file) {
   
    const uploadResult = await this.s3Upload.uploadFile(fil.buffer, fil.originalname);
    fileUrls.push(uploadResult.fileUrl);
  }
  return { fileUrls };
}


/** Creates a new product, only for admins */
@ApiOperation({ summary: 'Admin creates a new product' })
// @IsAdmin()
@Public()
@Post()
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      basePrice: {
        type: 'number'
      },
      discountPercentage: {
        type: 'number'
      },
      stock: {
        type: 'number'
      },
      description: {
        type: 'string'
      },
      categories: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  }
})
async create(
  @Body() createProductDto: CreateProductDto
): Promise<Product> {
  return this.productService.create(createProductDto);
}


  /** Returns all products with pagination
   *
   * Default is starting on page 1 showing 10 results per page,
   * searching and ordering by name
   */
  @ApiOperation({ summary: 'Returns all products' })
  @Public()
  @Get()
  findAll(@Query() findAllProductsDto: FindProductsDto): Promise<Product[]> {
    return this.productService.findAll(findAllProductsDto);
  }


  

  /** Find product by ID, only for admins */
  @ApiOperation({ summary: 'Admin gets product by ID' })
  @Public()
  @Get('/id/:id')
  findOneById(@Param('id') id: string): Promise<Product> {
    return this.productService.findOneById(id);
  }


    /** Find product by ID, only for admins */
    @ApiOperation({ summary: 'Admin gets product by SellerID' })
    @Public()
    @Get('/seller/:id')
    findOneBySellerId(@Param('id') id: string)
    // : Promise<Product>
     {
      return this.productService.findOneBySellerId(id);
    }


    /** Find product by ID, only for admins */
    @ApiOperation({ summary: 'Admin gets product by Category' })
    @Public()
    @Get('/category/:id')
    findOneByCategory(@Param('id') id: string){
      return this.productService.findProductsByCategory(id);
    }
  

  /** Find product by Url Name */
  @ApiOperation({ summary: 'Gets product by urlName' })
  @Public()
  @Get(':urlName')
  findOneByUrlName(@Param('urlName') urlName: string): Promise<Product> {
    return this.productService.findOneByUrlName(urlName);
  }

  /**
   * Admin uploads a new picture for the product.
   * Needs to be type jpeg, jpg or png and maximum 3MB.
   *
   * Check <a href="https://alvaromrveiga.github.io/ecommerce-backend/miscellaneous/variables.html#multerUploadConfig">
   * multerUploadConfig</a> file in the docs.
   */
  @ApiOperation({ summary: 'Admin uploads a new product picture' })
  @IsAdmin()
  @FileUpload()
  @Patch('picture/:id')
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: File,
  ): Promise<Product> {
    return this.productService.uploadPicture(id, file);
  }

  /** Updates product information, only for admins */
  @ApiOperation({ summary: 'Admin updates product' })
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  /** Deletes product from database, only for admins */
  @ApiOperation({ summary: 'Admin deletes product' })
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
