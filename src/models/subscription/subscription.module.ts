import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerUploadConfig } from 'src/config/multer-upload.config';
import { S3Upload } from 'src/util/s3-uploader';

@Module({
  controllers: [SubscriptionController],
  imports: [PrismaModule, MulterModule.register(multerUploadConfig)],
  providers: [SubscriptionService,S3Upload],
})
export class SubscriptionModule {}
