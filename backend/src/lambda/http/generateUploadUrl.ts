import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { AwsS3 } from '../../lib/s3';
import { CreateSignedURLRequest } from '../../requests/CreateSignedURLRequest';
import { constructResponse } from '../../lib/response';
import { constructError } from '../../lib/error';
import { createLogger } from '../../utils/logger';
import { DynamoDB } from '../../lib/dynamodb'

const logger = createLogger('GenerateUrl');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Set the values for the create signed url request class
  const todoId = event.pathParameters.todoId
  const bucketName = process.env.S3_BUCKET;

  logger.info('Reached generate url function', todoId);
  logger.info('S3 bucket name', bucketName);

  if(!todoId) return constructError(400, 'No todo id sent with request');

  // Instantiate new S3 class 
  let s3 = new AwsS3();

  // Create a new CreateSignedURLRequest object
  const createSignedUrlRequest: CreateSignedURLRequest = {
    Bucket: s3.getBucket(),
    Key: todoId,
    Expires: process.env.SIGNED_URL_EXPIRATION
  };

  logger.info('After create signed url', createSignedUrlRequest);

  // Get a signed URL from S3 class
  let signedUrl = await s3.getPresignedUrl(createSignedUrlRequest);

  
  let dynamodb = new DynamoDB(process.env.TODOS_TABLE);
  await dynamodb.updateTodoAttachmentUrl(todoId)
  // Construct and return a successful response to the client
  return constructResponse(202, {uploadUrl: signedUrl});
//   return {
//     statusCode: 202,
//     headers: {
//        'Access-Control-Allow-Origin': '*',
//        'Access-Control-Allow-Credentials': true
//     },
//     body: JSON.stringify({uploadUrl: signedUrl})
//  };
  
}
