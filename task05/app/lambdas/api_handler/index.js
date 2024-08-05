const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.region });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Events';

exports.handler = async (event) => {
  const { principalId, content } = event;

  const id = uuidv4();
  const createdAt = new Date().toISOString();

  const eventItem = {
    id,
    principalId,
    createdAt,
    body: content,
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.target_table,
        Item: eventItem,
      })
      .promise();

    return {
      statusCode: 201,
      event: eventItem,
    };
  } catch (err) {
    console.log(err.__type);
    return JSON.stringify(err, null, 2);
  }
};
