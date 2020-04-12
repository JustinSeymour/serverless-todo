import 'source-map-support/register';
import uuid from 'uuid';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createLogger } from '../../utils/logger';
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../../lambda/utils'; 
import { DynamoDB } from './../../lib/dynamodb';
import { constructError } from './../../lib/error';
import { constructResponse } from './../../lib/response';

const logger = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  if(!newTodo) return constructError(400, 'No TODO payload sent with request');

  logger.info('Todo body from request: ', newTodo);

  const todoId = uuid.v4();
  const userId = getUserId(event);
  const createdAt = new Date(Date.now()).toISOString();
  
  const todoItem: TodoItem = {
      userId: userId,
      todoId: todoId,
      createdAt: createdAt,
      done: false,
      attachmentUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${todoId}`,
      ...newTodo
  };
  
  let dynamoDb = new DynamoDB(process.env.TODOS_TABLE);
  await dynamoDb.creatItem(todoItem);

  return constructResponse(201, {item: todoItem});

}