const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

// AWS.config.update({
//     region: 'ap-northeast-2',
//     endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
// })
const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,access-token"
};

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
    DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

exports.handler = async (event, context) => {
    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

    const params = {
        TableName: "cdkdemo_notice",
        Item: item,
    };
    try {
        await ddb.put(params).promise();
        return { statusCode: 201, body: JSON.stringify('nice'), headers };
    } catch (dbError) {
        const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
            DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
        console.log(dbError);
        return { statusCode: 500, body: errorResponse, headers };
    }
    
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
};
