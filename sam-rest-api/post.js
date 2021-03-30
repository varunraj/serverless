const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-south-1' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME

exports.handler = async (event) => {

    let userid = event.pathParameters.userid // userid is in path
    let { firstName, lastName, email, website } = JSON.parse(event.body)


    let item = {
        userid,
        firstName,
        lastName,
        email,
        website
    }

    let data = await dynamoDB.put({
        TableName: tableName,
        Item: item
    }).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'data added succesfully'
        })
    }


}