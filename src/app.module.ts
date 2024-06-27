import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessJwtAuthGuard } from './auth/access-jwt-auth.guard';
import { UserModule } from './models/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './models/product/product.module';
import { CategoryModule } from './models/category/category.module';
import { PurchaseModule } from './models/purchase/purchase.module';
import { ChatGateWayModule } from './chatgateway/chatgateway.module';
import { ChatWebsocketGateway } from './chatgateway/chat.gateway.service';
import { RoomsController } from './chatgateway/rooms.controller';
import { SubscriptionModule } from './models/subscription/subscription.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ProductModule,
    CategoryModule,
    PurchaseModule,
    ChatGateWayModule,
    SubscriptionModule
    
    
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessJwtAuthGuard,

    },
    ChatWebsocketGateway
  ],

  controllers: [RoomsController],
})
export class AppModule {}
