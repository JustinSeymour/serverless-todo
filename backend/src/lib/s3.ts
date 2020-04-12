import { CreateSignedURLRequest } from "../requests/CreateSignedURLRequest"
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import {Types} from 'aws-sdk/clients/s3'

const XAWS = AWSXRay.captureAWS(AWS);

export class AwsS3 {

   constructor(
      private readonly bucket = process.env.S3_BUCKET,
      private readonly s3: Types = new XAWS.S3({ signatureVersion: 'v4'})) {
   }

   getBucket() {
      return this.bucket;
   }

   async getPresignedUrl(createSignedUrlRequest: CreateSignedURLRequest): Promise<string> {

      let url =  this.s3.getSignedUrl('putObject', createSignedUrlRequest);
      return url as string;

   }

}