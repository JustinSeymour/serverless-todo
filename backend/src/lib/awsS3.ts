import { CreateSignedURLRequest } from "../requests/CreateSignedURLRequest"
import * as AWS from 'aws-sdk'
import {Types} from 'aws-sdk/clients/s3'


export class AwsS3 {

   constructor(
      private readonly bucket = process.env.S3_BUCKET,
      private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4'})) {
   }

   getBucket() {
      return this.bucket;
   }

   async getPresignedUrl(createSignedUrlRequest: CreateSignedURLRequest): Promise<string> {

      let url =  this.s3Client.getSignedUrl('putObject', createSignedUrlRequest);
      return url as string;

   }

}