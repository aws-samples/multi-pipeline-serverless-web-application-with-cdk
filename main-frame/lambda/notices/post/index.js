const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

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
        await ddb.send(new PutCommand(params));
        return { statusCode: 201, body: JSON.stringify('nice'), headers };
    } catch (dbError) {
        // SDK v3 reports the service error code on `name`; v2 used `code`.
        const errorResponse = dbError.name === 'ValidationException' && dbError.message.includes('reserved keyword') ?
            DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
        console.log(dbError);
        return { statusCode: 500, body: errorResponse, headers };
    }
};
