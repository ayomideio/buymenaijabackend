import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Product } from '../entities/product.entity';
import { Type } from 'class-transformer';



export class SpecificationDto {
  @ApiProperty({
    description: 'The name of Party A',
    example: 'Party A',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The name of Party B',
    example: 'Party B',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  value: string;
}

/** Describes the fields needed to create a Product */
export class CreateProductDto extends OmitType(Product, [
  'id',
  'createdAt',
  'urlName',
] as const) {
  /**
   * Product name
   * @example "Brand black wheelchair"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Product price not considering discounts.
   * Saved as decimal, calculations should be handled
   * with currency.js
   * @example 70.00
   */
  @IsNumber()
  @IsNotEmpty()
  basePrice: string | number | Decimal;

  /**
   * Product discount in percentage. Defaults to 0
   * @example 10
   */
  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  /** Product stock amount. Defaults to 0
   * @example 42
   */
  @IsInt()
  @IsOptional()
  stock?: number;

  /**
   * Product description
   * @example "Black wheelchair for offices"
   */
  @IsString()
  @IsOptional()
  description?: string;

   /**
   * Product description
   * @example "Black wheelchair for offices"
   */
   @IsString()
   @IsOptional()
   shortDescription?: string;

   /**
   * Product description
   * @example "Black wheelchair for offices"
   */
   @IsString()
   @IsOptional()
   longDescription?: string;





    /**
   * Product description
   * @example "Black wheelchair for offices"
   */
    @IsString()
  
    userId: string;

  /**
   * Category IDs
   * @example ["857cd575-956b-49f3-a75e-2e651e21b871", "fa244865-0878-4688-ac63-e3ecf4939a89"]
   */
  @IsOptional()
  @IsArray()
  categories?: string[];


   /**
   * URLs to the product images
   * @example ["https://s3.amazonaws.com/bucketname/filename1.jpg", "https://s3.amazonaws.com/bucketname/filename2.jpg"]
   */
   @IsArray()
   @IsString({ each: true })
   @IsOptional()
   picture?: string[];


  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  @Type(() => SpecificationDto)

  specifications: SpecificationDto[];
}
