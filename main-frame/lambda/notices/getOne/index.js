const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,access-token"
};

exports.handler = async (event, context) => {
    const itemId = event.pathParameters.id;
    const titleParam = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    
    if(!itemId) {
        console.log('Id is null');
        return { statusCode:404, body: 'Id is null'}
    } else {
        const params = {
            TableName: "cdkdemo_notice",
            Key: {
                "id": itemId,
                "title": titleParam.title,
            }
        };
        
        try {
            const response = await ddb.get(params).promise();
            console.log('response : ');
            console.log(response);
            
            if(response.Item) {
                return {
                    statusCode: 200, body: JSON.stringify(response.Item),
                    headers,
                };
            } else {
                return { statusCode: 404, headers };
            }
        } catch (dbError) {
            return { statusCode: 500, body: dbError, headers };
        }   
    }
};
