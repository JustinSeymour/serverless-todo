import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { constructError } from '../../lib/error'
import { DynamoDB } from '../../lib/dynamodb'
import { getUserId } from '../utils'
// import { constructResponse } from '../../lib/response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Set the values for update item function
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event);

  // Check to see if todo id parameter was went with the request
  if(!todoId) return constructError(400,'No TODO id sent with the request');

  // Check to see if any data has been sent in the payload to be updated
  if(!updatedTodo) return constructError(400,'No update information sent in payload');

  // Instantiate the dynamoDB helper class
  let dynamoDB = new DynamoDB(process.env.TODOS_TABLE);

  // Check to see if the todo exists
  let item = dynamoDB.getItem(todoId, userId);
  if(!item) return constructError(404, `TODO with id ${todoId} does not exist`);

  // Update the todo item in the DB
  await dynamoDB.updateItem(todoId, userId, updatedTodo);

  // Send response to client
  // return constructResponse(200, {});
  return {
    statusCode: 200,
    headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
 };

}
