const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,access-token"
};

exports.handler = async (event, context) => {

    const params = {
        TableName: "cdkdemo_notice",
    };
    
    try {
        const response = await ddb.scan(params).promise();
        console.log(response);
        if(response.Items) {
            return {
                statusCode: 200, body: JSON.stringify(response.Items),
                headers,
            };
        } else {
            return { statusCode: 404, headers };
        }
    } catch (dbError) {
        return { statusCode: 500, body: dbError, headers };
    }   
};
