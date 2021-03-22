const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const s3 = new AWS.S3();

exports.handler = async (event) => {
    let params = {
        Bucket: event.s3.bucket.name,
        Key: event.s3.object.key
    };
    
    await s3.deleteObject(params).promise();
    return true;
};