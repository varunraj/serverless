// S3 Configurations needed

// 1) create source and destination s3 bucket (ending with -dest)
// 2) In the source bucket, under events, create a new event for 'put', for destination, select lambda function where this will be sent to.


// all below modules are are part of aws lambda run time. So we dont need to package them; 

const im = require('imagemagick'); // this is available only in node 8 runtime of AWS labda. So this wont work in other node versions.
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuid/v4');
const { promisify } = require('util');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });
const s3 = new AWS.S3()

// converts all cb type functions to promises
const resizeAsync = promisify(im.resize); // async version of im.resize
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

exports.handler = async (event) => {

    // use the text function in console to look up the format of S3 put event. We can see that image name will in the path 
    // {"Records":[
    //     {},
    //     "s3":{
    //         "object":{
    //             "key":"image-name"
    //         }  
    // ]}

    let filesProcessed = event.Records.map(async (record) => {
        let bucket = record.s3.bucket.name;
        let fileName = record.s3.object.key

        //get file from s3
        var params = {
            Bucket: bucket,
            Key: fileName
        };

        let inputData = await s3.getObject(params).promise(); // .promise() is used to convert
        // from cb to promise

        // resize the file

        let tempFile = os.tmpdir() + '/' + uuidv4() + '.jpg';
        let resizeArgs = {
            srcData: inputData.Body,
            dstPath: tempFile,
            width: 150,
        }

        await resizeAsync(resizeArgs);

        // Read the resized file

        let resizedData = await readFileAsync(tempFile)

        // upload new file to s3

        let targetFilename = fileName.substring(0, filename.lastIndexOf('.')) + '-small.jpg'
        var params = {
            Bucket: bucket + '-dest', // destination bucket ends with -dest
            Key: targetFilename,
            Body: new Buffer(resizedData),
            ContentType: 'image/jpeg'
        };

        await s3.putObject(params).promise()
        return await unlinkAsync(tempFile);

    });

    await Promise.all(filesProcessed)
    console.log("done")
    return "done"

}
