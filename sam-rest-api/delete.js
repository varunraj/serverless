const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-south-1' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME

exports.handler = async (event) => {


    let userid = event.pathParameters.userid

    let data = await dynamoDB.delete({
        TableName: tableName,
        Key: {
            userid
        }
    }).promise()


    return {
        statusCode: 200,
        body: JSON.stringify({
            "message": "User deleted succesfully"
        })
    }


}