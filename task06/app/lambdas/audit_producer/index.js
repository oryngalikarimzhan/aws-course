const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: process.env.region });
const auditTableName = process.env.target_table;

exports.handler = async (event) => {
  const records = event.Records;

  console.log('Event from Configuration table', { event, target: process.env.target_table });
  for (const record of records) {
    if (record.eventName === 'INSERT') {
      const newImage = unmarshall(record.dynamodb.NewImage);

      const configurationItem = {
        key: newImage.key,
        value: newImage.value,
      };

      const auditItem = {
        id: uuidv4(),
        itemKey: configurationItem.key,
        modificationTime: new Date().toISOString(),
        newValue: configurationItem,
      };

      await client.send(
        new PutItemCommand({
          TableName: auditTableName,
          Item: marshall(auditItem),
        })
      );
    }

    if (record.eventName === 'MODIFY') {
      const newImage = unmarshall(record.dynamodb.NewImage);
      const oldImage = unmarshall(record.dynamodb.OldImage);

      const oldValue = oldImage.value;
      const newValue = newImage.value;

      if (oldValue !== newValue) {
        const auditItem = {
          id: uuidv4(),
          itemKey: newImage.key,
          modificationTime: new Date().toISOString(),
          updatedAttribute: 'value',
          oldValue: oldValue,
          newValue: newValue,
        };

        await client.send(
          new PutItemCommand({
            TableName: auditTableName,
            Item: marshall(auditItem),
          })
        );
      }
    }
  }
};
