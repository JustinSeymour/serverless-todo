import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getUserId } from '../utils';
import { DynamoDB } from './../../lib/dynamodb';
import { constructError } from './../../lib/error';
import { constructResponse } from './../../lib/response';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Reached get todos handler', event);

    // Set the userId from request and send error if none is present
    const userId = getUserId(event);
    if(!userId) return constructError(400, 'No userId sent with request');

    // Instantiate the dynamoDB class
    let dynamodb = new DynamoDB(process.env.TODOS_TABLE);

    // Get all todos using dynamodb helper class
    let items = await dynamodb.getAll(userId, process.env.INDEX_NAME);

    //Construct response
    return constructResponse(201, {items: items});

}
