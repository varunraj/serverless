
const moment = require('moment')
const greetings = {
    "en": "Hello",
    "fr": "Bonjour",
    "hi": "Namaster",
    "en": "Hello",
    "fr": "Bonjour",
    "hi": "Namaster",
    "en": "Hello",
    "fr": "Bonjour",
    "hi": "Namaster",
    "hi": "Namaster"
}

exports.handler = async (event, context) => {

    // event dependent on event source
    // context is the environment where lambda. remaining time, function name etc.

    // context.getRemainingTimeInMissis() -> remaining time before time out

    // const name = context.functionName; // name of the func
    // const version = context.functionVersion

    // context.functionArn
    // context.awsRequestId
    // context.memoryLimitInMB
    // context.identity // Cognito 
    // context.logGroupName
    // context.clientContext;

    // Error Throwing

    // console.error('error occured')
    // console.log('error occured')
    // console.info('error occured')
    // console.warn('error occured') // all will be logged to cloudwatch

    // const err = new Error('An Error Happened');
    // throw err; // this will show in cloudWatch Logs.


    // Get and path and Query Params

    let name = event.pathParameters.name // we can find the structureof event using the test event from api-proxy 

    // get lang from query param
    let { lang, ...info } = event.queryStringParameters || {}; //info is optional. OR part is to set empty object is query param is empty 


    let message = `${greetings[lang] ? greetings[lang] : greetings['en']} ${name}`

    let response = {
        message,
        info,
        timeStamp: moment().unix()
    }

    // return a proper http response. We will use lambda proxy for the api using this function. So we need to set all http response details inside function itself.

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*" // for CORS. We can also set this from console.
        },
        body: JSON.stringify(response)
    }

}



