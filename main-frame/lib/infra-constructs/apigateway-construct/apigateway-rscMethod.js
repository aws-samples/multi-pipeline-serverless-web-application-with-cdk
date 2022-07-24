"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRscMethod = void 0;
const apiGateway = require("aws-cdk-lib/aws-apigateway");
const constructs_1 = require("constructs");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const shared_1 = require("../../../config/shared");
const cdk = require("aws-cdk-lib");
class ApiRscMethod extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const accountId = cdk.Stack.of(this).account; // or this.account
        // reference imported lambda. below function can modify/add existing roles.
        const exLambda = lambda.Function.fromFunctionAttributes(this, 'exLambda', {
            functionArn: `arn:aws:lambda:${shared_1.CONSTANTS.REGION}:${accountId}:function:helloworld`,
            sameEnvironment: true,
        });
        // create resource
        this.noticeRsc = props.apiGW.root.addResource('temporary');
        // add method
        this.noticeRsc.addMethod('GET', new apiGateway.LambdaIntegration(exLambda, { proxy: true }));
        // exLambda.addPermission();
        exLambda.grantInvoke(new aws_iam_1.ServicePrincipal('apigateway.amazonaws.com'));
        this.noticeRsc.addCorsPreflight({
            allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
            allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowCredentials: true,
            allowOrigins: ['*'],
        })
        // api gateway deploy
        const currntStage = 'stg';
        const deployment = new apiGateway.Deployment(this, 'Deployment', { api: props.apiGW });
        const stage = new apiGateway.Stage(this, `${currntStage}_stage`, {
            deployment,
            stageName: `${currntStage}`,
        });
        props.apiGW.deploymentStage = stage;
        // api gateway output
        new cdk.CfnOutput(this, 'apiGWUrl', {
            value: props.apiGW.url,
            exportName: 'ApiGWUrl',
        });
    }
}
exports.ApiRscMethod = ApiRscMethod;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpZ2F0ZXdheS1yc2NNZXRob2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGlnYXRld2F5LXJzY01ldGhvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5REFBeUQ7QUFDekQsMkNBQXVDO0FBQ3ZDLGlEQUFpRDtBQUNqRCxpREFBdUQ7QUFDdkQsbURBQW1EO0FBQ25ELG1DQUFtQztBQU1uQyxNQUFhLFlBQWEsU0FBUSxzQkFBUztJQUd2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQy9ELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsa0JBQWtCO1FBRWhFLDJFQUEyRTtRQUMzRSxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEUsV0FBVyxFQUFFLGtCQUFrQixrQkFBUyxDQUFDLE1BQU0sSUFBSSxTQUFTLHNCQUFzQjtZQUNsRixlQUFlLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUE7UUFFRixrQkFBa0I7UUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0QsYUFBYTtRQUNiLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUNwQixLQUFLLEVBQ0wsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQzVELENBQUM7UUFDRiw0QkFBNEI7UUFDNUIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLDBCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztRQUV2RSxvQ0FBb0M7UUFDcEMsa0ZBQWtGO1FBQ2xGLDBFQUEwRTtRQUMxRSw4QkFBOEI7UUFDOUIsMkJBQTJCO1FBQzNCLEtBQUs7UUFFTCxxQkFBcUI7UUFDckIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxXQUFXLFFBQVEsRUFBRTtZQUM3RCxVQUFVO1lBQ1YsU0FBUyxFQUFFLEdBQUcsV0FBVyxFQUFFO1NBQzlCLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUVwQyxxQkFBcUI7UUFDckIsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDaEMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRztZQUN0QixVQUFVLEVBQUUsVUFBVTtTQUN6QixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUE5Q0Qsb0NBOENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBpR2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENPTlNUQU5UUyB9IGZyb20gJy4uLy4uLy4uL2NvbmZpZy9zaGFyZWQnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcblxuZXhwb3J0IGludGVyZmFjZSBBcGlHV0NvbnRydWN0UHJvcHMge1xuICAgIGFwaUdXOiBhcGlHYXRld2F5LlJlc3RBcGksXG59XG5cbmV4cG9ydCBjbGFzcyBBcGlSc2NNZXRob2QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgIHB1YmxpYyBub3RpY2VSc2M6IGFwaUdhdGV3YXkuUmVzb3VyY2U7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXBpR1dDb250cnVjdFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgY29uc3QgYWNjb3VudElkID0gY2RrLlN0YWNrLm9mKHRoaXMpLmFjY291bnQ7IC8vIG9yIHRoaXMuYWNjb3VudFxuXG4gICAgICAgIC8vIHJlZmVyZW5jZSBpbXBvcnRlZCBsYW1iZGEuIGJlbG93IGZ1bmN0aW9uIGNhbiBtb2RpZnkvYWRkIGV4aXN0aW5nIHJvbGVzLlxuICAgICAgICBjb25zdCBleExhbWJkYSA9IGxhbWJkYS5GdW5jdGlvbi5mcm9tRnVuY3Rpb25BdHRyaWJ1dGVzKHRoaXMsICdleExhbWJkYScsIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uQXJuOiBgYXJuOmF3czpsYW1iZGE6JHtDT05TVEFOVFMuUkVHSU9OfToke2FjY291bnRJZH06ZnVuY3Rpb246aGVsbG93b3JsZGAsXG4gICAgICAgICAgICBzYW1lRW52aXJvbm1lbnQ6IHRydWUsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gY3JlYXRlIHJlc291cmNlXG4gICAgICAgIHRoaXMubm90aWNlUnNjID0gcHJvcHMuYXBpR1cucm9vdC5hZGRSZXNvdXJjZSgndGVtcG9yYXJ5Jyk7XG4gICAgICAgIC8vIGFkZCBtZXRob2RcbiAgICAgICAgdGhpcy5ub3RpY2VSc2MuYWRkTWV0aG9kKFxuICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICBuZXcgYXBpR2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihleExhbWJkYSwge3Byb3h5OiB0cnVlfSlcbiAgICAgICAgKTtcbiAgICAgICAgLy8gZXhMYW1iZGEuYWRkUGVybWlzc2lvbigpO1xuICAgICAgICBleExhbWJkYS5ncmFudEludm9rZShuZXcgU2VydmljZVByaW5jaXBhbCgnYXBpZ2F0ZXdheS5hbWF6b25hd3MuY29tJykpO1xuXG4gICAgICAgIC8vIHRoaXMubm90aWNlUnNjLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgICAgICAvLyAgICAgYWxsb3dIZWFkZXJzOiBbJ0NvbnRlbnQtVHlwZScsICdYLUFtei1EYXRlJywgJ0F1dGhvcml6YXRpb24nLCAnWC1BcGktS2V5J10sXG4gICAgICAgIC8vICAgICBhbGxvd01ldGhvZHM6IFsnT1BUSU9OUycsICdHRVQnLCAnUE9TVCcsICdQVVQnLCAnUEFUQ0gnLCAnREVMRVRFJ10sXG4gICAgICAgIC8vICAgICBhbGxvd0NyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAvLyAgICAgYWxsb3dPcmlnaW5zOiBbJyonXSxcbiAgICAgICAgLy8gfSlcblxuICAgICAgICAvLyBhcGkgZ2F0ZXdheSBkZXBsb3lcbiAgICAgICAgY29uc3QgY3Vycm50U3RhZ2UgPSAnc3RnJztcbiAgICAgICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlHYXRld2F5LkRlcGxveW1lbnQodGhpcywgJ0RlcGxveW1lbnQnLCB7IGFwaTpwcm9wcy5hcGlHVyB9KTtcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSBuZXcgYXBpR2F0ZXdheS5TdGFnZSh0aGlzLCBgJHtjdXJybnRTdGFnZX1fc3RhZ2VgLCB7XG4gICAgICAgICAgICBkZXBsb3ltZW50LFxuICAgICAgICAgICAgc3RhZ2VOYW1lOiBgJHtjdXJybnRTdGFnZX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgcHJvcHMuYXBpR1cuZGVwbG95bWVudFN0YWdlID0gc3RhZ2U7XG5cbiAgICAgICAgLy8gYXBpIGdhdGV3YXkgb3V0cHV0XG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdhcGlHV1VybCcsIHtcbiAgICAgICAgICAgIHZhbHVlOiBwcm9wcy5hcGlHVy51cmwsXG4gICAgICAgICAgICBleHBvcnROYW1lOiAnQXBpR1dVcmwnLFxuICAgICAgICB9KTtcbiAgICB9XG59Il19