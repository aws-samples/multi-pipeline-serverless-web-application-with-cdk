const { APIGatewayClient, CreateDeploymentCommand } = require('@aws-sdk/client-api-gateway');
var aPIGateway = new APIGatewayClient({});

var params = {
    restApiId: process.env.RESTAPI_ID,
    stageName: process.env.STAGE,
}

exports.handler = async (event) => {
    try {
        await aPIGateway.send(new CreateDeploymentCommand(params));
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
