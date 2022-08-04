const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const { response } = require('express');
require('dotenv/config')


AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'device_data';

router.get('/', async (req, res) => {
    const params ={
        TableName: dynamodbTableName,
        Key: {
            'deviceId': req.query.deviceId
        }
    }
    await dynamodb.get(params).promise().then(response => {
        res.json(response.Item);
    }, error => {
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
    })
})


router.get('/all', async (req, res) => {
    const params ={
        TableName: dynamodbTableName
    }
    try {
        const alldevice = await scanDynamoRecords(params, []);
        const body = {
            device: alldevice
        }
        res.json(alldevice);
    } catch(error){
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
    }
})

router.post('/', async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        Item: req.body
      }
      await dynamodb.put(params).promise().then(() => {
        const body = {
          Operation: 'SAVE',
          Message: 'SUCCESS',
          Item: req.body
        }
        res.json(body);
      }, error => {
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
      })
})

router.patch('/', async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        Key: {
          'deviceId': req.body.productId
        },
        UpdateExpression: `set ${req.body.updateKey} = :value`,
        ExpressionAttributeValues: {
          ':value': req.body.updateValue
        },
        ReturnValues: 'UPDATED_NEW'
      }
      await dynamodb.update(params).promise().then(response => {
        const body = {
          Operation: 'UPDATE',
          Message: 'SUCCESS',
          UpdatedAttributes: response
        }
        res.json(body);
      }, error => {
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
      })
})

router.delete('/', async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        Key: {
          'deviceId': req.body.productId
        },
        ReturnValues: 'ALL_OLD'
      }
      await dynamodb.delete(params).promise().then(response => {
        const body = {
          Operation: 'DELETE',
          Message: 'SUCCESS',
          Item: response
        }
        res.json(body);
      }, error => {
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
      })
})

async function scanDynamoRecords(scanParams, itemArray){
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if(dynamoData.LastEvaluatedKey) {
            scanParams.ExlusiveStartKey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    }   catch(error){
        throw new Error(error);
    }
}

module.exports = router;
