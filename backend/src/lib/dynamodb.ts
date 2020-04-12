import { TodoUpdate } from "../models/TodoUpdate";

import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { TodoItem } from "../models/TodoItem";
const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient()

// Create the module to export
export class DynamoDB {

   private readonly table: string;


   constructor(table) {
      this.table = table;
   }

   /**
    * Save a todo item to dynamo DB
    * @param item a todo item created from payload request
    *
    * @returns void
   */
   async creatItem(item: TodoItem) {

      try {

         await docClient.put({
            TableName: this.table,
            Item: item
         }).promise();

      } catch (err) {
         throw new Error(err)
      }

   }

   async getItem(todoId, userId) {

      try {
   
         return await docClient.get({
            TableName: this.table,
            Key: {
               todoId,
               userId
            }
        }).promise();
   
      } catch(e) {
         throw new Error(e);
      }
      
   };

   async deleteItem(todoId, userId) {

      try {
   
         await docClient.delete({
            TableName: this.table,
            Key: {
               todoId,
               userId
            }
        }).promise();
   
      } catch(e) {
         throw new Error(e);
      }
      
   };

   async getAll(userId, indexName) {

      try {
         
         const result = await docClient.query({
            TableName: this.table,
            IndexName: indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
  
        return result.Items;
   
      } catch(e) {
         console.log("Failed to query database get all  \n"+e);
         throw new Error(e);
      }
      
   };

   async updateItem(todoId: string, 
                    userId: string, 
                    todoUpdate: TodoUpdate) {
      await docClient.update({
          TableName: this.table,
          Key: {
              todoId,
              userId
          },
          UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
          ExpressionAttributeValues: {
              ':n': todoUpdate.name,
              ':due': todoUpdate.dueDate,
              ':d': todoUpdate.done
          },
          ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
          }
      }).promise();
  };

  async updateTodoAttachmentUrl(todoId: string){

   await docClient.update({
       TableName: this.table,
       Key: {
           "todoId": todoId
       },
       UpdateExpression: "set attachmentUrl = :attachmentUrl",
       ExpressionAttributeValues: {
           ":attachmentUrl": `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${todoId}`
       }
   }).promise();
}

}