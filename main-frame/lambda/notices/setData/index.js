const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,access-token"
};

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
    DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

const tableName = 'cdkdemo_notice';
const params = {
    RequestItems: {
        [tableName]: [
            {
                PutRequest: {
                    Item: {
                        id: '100',
                        title: 'conan',
                        writer: 'Tom',
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        id: '101',
                        title: 'thunder',
                        writer: 'Dior',
                    },
                },
            },
            {
                PutRequest: {
                    Item: {
                        id: '102',
                        title: 'Onepiece',
                        writer: 'gavy',
                    },
                },
            },
        ],
    },
};

exports.handler = async (event, context) => {
    try {
        await ddb.send(new BatchWriteCommand(params));
        return { statusCode: 201, body: JSON.stringify('nice'), headers };
    } catch (dbError) {
        // SDK v3 reports the service error code on `name`; v2 used `code`.
        const errorResponse = dbError.name === 'ValidationException' && dbError.message.includes('reserved keyword') ?
            DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
        console.log(dbError);
        return { statusCode: 500, body: errorResponse, headers };
    }
};
