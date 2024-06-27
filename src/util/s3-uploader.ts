import { S3 } from "aws-sdk"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  getSignedUrl,
  S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";
const client = new S3Client({})

import { v4 as uuid } from 'uuid';
import { Injectable } from "@nestjs/common";
import * as path from 'path';
@Injectable()
export class S3Upload{
  
         getPresignUrlPromiseFunction(s3, s3Params): Promise<string>{
          return new Promise(async (resolve, reject) => {
          try {
              await s3.getSignedUrl('putObject', s3Params, function (err,         data) {
          if (err) {
          return reject(err);
          }
          resolve(data);
        });
      } catch (error) {
          return reject(error);
          }
        });
      }

       createPresignedUrlWithClient = async ({ region, bucket, key }) => {
        const client = new S3Client({ region });
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(client, command, { expiresIn: 3600 });
      };

        async uploadFile(dataBuffer: Buffer, fileName: string){
          if (!dataBuffer || dataBuffer.length === 0) {
            throw new Error('Invalid file buffer');
          }
            const s3 = new S3();
            const uploadResult = await s3.upload({
                Bucket:process.env.AWS_BUCKET_NAME ,
                Body: dataBuffer,
                ContentType: path.extname(fileName),
               
                Key: `${uuid()}-${fileName}`,
            }).promise();
    const presignedUri=await this.createPresignedUrlWithClient({
      region:process.env.AWS_REGION,
      bucket:process.env.AWS_BUCKET_NAME,
      key:uploadResult.Key
    });
            const fileStorageInDB = ({
                fileName: fileName,
                
                fileUrl: uploadResult.Location,
                key: uploadResult.Key,
                publicUrl:presignedUri
            });
           
    
            return fileStorageInDB;
        } 

        async getFIle(){
            const command = new GetObjectCommand({
                Bucket: "test-bucket",
                Key: "hello-s3.txt"
              });
            
              try {
                const response = await client.send(command);
                // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
                const str = await response.Body.transformToString();
                console.log(str);
              } catch (err) {
                console.error(err);
              }
        }
}