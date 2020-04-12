import { CreateSignedURLRequest } from "../requests/CreateSignedURLRequest";
import * as AWS from 'aws-sdk';
import {Types} from 'aws-sdk/clients/s3';


export class AwsS3 {


   constructor(
      private readonly bucket = process.env.S3_BUCKET,
      private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4'})) {
   }

   getBucket() {
      console.log("Reached get bucket from S3  \n");
      return this.bucket;
   }

   async getPresignedUrl(createSignedUrlRequest: CreateSignedURLRequest): Promise<string> {
      console.log("Reached get presigned from S3  \n");
      let url =  this.s3Client.getSignedUrl('putObect', createSignedUrlRequest);
      console.log("Url from get sighned url s3w  \n"+url);
      return url as string;
   }

}