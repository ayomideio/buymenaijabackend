import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import {  CreateSubscriptionDto } from './dto/create-subscription.dto';
import { FindSubscriptionsDto } from './dto/find-subscription.dto';

import { Subscription } from './entities/subscription.entity';
import { Prisma, SubscriptionPlan } from '@prisma/client';


/** Responsible for managing products in the database.
 * CRUD endpoints are available for products.
 */
@Injectable()
export class SubscriptionService {
  /** Responsible for managing products in the database.
   * CRUD endpoints are available for products.
   *
   * Instantiates the class and the PrismaService dependency
   */
  constructor(private readonly prisma: PrismaService) {}

  private readonly pricing = {
    [SubscriptionPlan.BASIC]: new Prisma.Decimal(3000),
    [SubscriptionPlan.STANDARD]: new Prisma.Decimal(8000),
    [SubscriptionPlan.PREMIUM]: new Prisma.Decimal(15000),
  };


  /** Creates a new product */
  async create(data: CreateSubscriptionDto): Promise<Subscription> {
    const price = this.pricing[data.plan];
    return this.prisma.subscription.create({
      data: {
        userId: data.userId,
        plan: data.plan,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status,
        price:price
      },
    });
  }



  /** Returns all products with pagination
   * Default is starting on page 1 showing 10 results per page
   * and ordering by name
   */
  async findAll({
    
    page = 1,
    offset = 10,
  }: FindSubscriptionsDto): Promise<Subscription[]> {
    const productsToSkip = (page - 1) * offset;

    return this.prisma.subscription.findMany({
      skip: productsToSkip,
      take: offset,
      // where: {
      //   name: { contains: productName, mode: 'insensitive' },
      // },
      orderBy: { createdAt: 'asc' },
      include: { 
        
      user:{select:{
        address:true,
        firstName:true,
        lastName:true,
        businessName:true,
        email:true,
        phoneNumber:true,
        avatar:true,
        isVerified:true,
        createdAt:true,
        instagram:true,
        facebook:true,
        whatsapp:true,
        twitter:true
        
      }}
      
      },
    });
  }

  /** Find product by ID */
  async findOneById(id: string): Promise<Subscription> {
    return this.prisma.subscription.findUnique({
      where: { id },
      include: {
       
    
    
    
     user:{select:{
      address:true,
      businessName:true,
      email:true,
      phoneNumber:true,
      avatar:true,
      isVerified:true,
      createdAt:true,
      instagram:true,
      facebook:true,
      whatsapp:true,
      twitter:true
      
    }}
    },

      rejectOnNotFound: true,
    });
  }



   /** Find products by Seller */
async findOneBySellerId(sellerId: string): Promise<Subscription[]> {
  return this.prisma.subscription.findMany({
    
    where: {
   userId:sellerId,
    },
    orderBy: { createdAt: 'asc' },
    include: { 
    
    user:{select:{
      address:true,
      businessName:true,
      email:true,
      phoneNumber:true,
      avatar:true,
      isVerified:true,
      createdAt:true,
      instagram:true,
      facebook:true,
      whatsapp:true,
      twitter:true
      
    }}
    
    },
  });
}
  






  /** Removes product from database */
  async remove(id: string): Promise<void> {
    await this.prisma.subscription.delete({ where: { id } });
  }


  
}
