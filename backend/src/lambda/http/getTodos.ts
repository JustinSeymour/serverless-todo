import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { DynamoDB } from './../../lib/dynamodb';
import { constructError } from './../../lib/error';
import { constructResponse } from './../../lib/response';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    console.log("Reaced get todos handler  \n");
    logger.info('Reached handler, winsoton error:', event);

    // Set the userId from request and send error if none is present
    const userId = getUserId(event);
    if(!userId) return constructError(400, 'No userId sent with request');

    // Instantiate the dynamoDB class
    let dynamodb = new DynamoDB(process.env.TODOS_TABLE);

    console.log("Dynamo Db Created  \n");
    logger.info('Dynamo Db Created, winsoton error:', dynamodb);

    // Get all todos using dynamodb helper class
    let items = await dynamodb.getAll(userId, process.env.INDEX_NAME);

    console.log("After get all  \n");
    logger.info('After get all, winsoton error:', items);
    //Construct response
    let response = constructResponse(201, {items: items});

    return response;
    // return {
    //     statusCode: 201,
    //     headers: {
    //        'Access-Control-Allow-Origin': '*',
    //        'Access-Control-Allow-Credentials': true
    //     },
    //     body: JSON.stringify({items: items})
    //  };

}
