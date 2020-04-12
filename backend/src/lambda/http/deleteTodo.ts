import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from './../../lib/dynamodb'
import { constructError } from './../../lib/error'
import { constructResponse } from './../../lib/response'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Set the defaults
  const todoId = event.pathParameters.todoId
  const tableName = process.env.TODOS_TABLE

  // Check to see if there is a todo id from request
  if(!todoId) {
    let error = constructError(400, 'No TODO id sent with payload');
    return error;
  }

  // Instantiate the Dynamo DB class
  let dynamodb = new DynamoDB(tableName);

  // Get todo from database
  const userId = getUserId(event);
  let item = dynamodb.getItem(todoId, userId);

  // If no todo item found return error 404
  if(!item) {
    let error = constructError(404, 'No TODO found with id sent');
    return error;
  }

  // Delete todo
  await dynamodb.deleteItem(todoId, userId);

  // Construct and return successful Response
  return constructResponse(201, {});

}
