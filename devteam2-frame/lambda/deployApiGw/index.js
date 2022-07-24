var AWS = require('aws-sdk');
var aPIGateway = new AWS.APIGateway();

var params = {
    restApiId: process.env.RESTAPI_ID,
    stageName: process.env.STAGE,
}

exports.handler = async (event) => {
    try {
        await aPIGateway.createDeployment(params).promise();
        console.log('success')
        return {
            statusCode: 200,
            body: JSON.stringify('DeployMent Complete'),
        };
      } catch (err) {
        console.log('fail');
        console.log(err)
        return {
            statusCode: 401,
            body: JSON.stringify('DeployMent fail'),
        };
      }
};
