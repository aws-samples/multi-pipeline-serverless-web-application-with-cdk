"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeLambdaConstruct = void 0;
const cdk = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const apiGateway = require("aws-cdk-lib/aws-apigateway");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const makingLambdaConstruct_1 = require("./makingLambdaConstruct");
class NoticeLambdaConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // create notice Lambda - POST
        // const noticePostLambda = new lambda.Function(this, 'noticePostLambda', {
        //     code: lambda.Code.fromAsset(path.join(__dirname, '/../../lambda/notices/post')),
        //     runtime: lambda.Runtime.NODEJS_16_X,
        //     handler: 'index.handler',
        //     memorySize: 512,
        //     timeout: cdk.Duration.seconds(5),
        //     functionName: 'noticePostLambda',
        //     currentVersionOptions: {
        //         removalPolicy: RemovalPolicy.DESTROY,
        //         retryAttempts: 2,
        //     },
        // });
        // noticePost Lambda create
        const noticePostLambda = new makingLambdaConstruct_1.makingLambdaConstruct(this, 'noticePost', {
            resourceName: 'notice',
            reqType: 'post',
            memorySize: 256,
            timeOut: 10,
        });
        // noticeGet Lambda create
        const noticeGetLambda = new makingLambdaConstruct_1.makingLambdaConstruct(this, 'noticeGet', {
            resourceName: 'notice',
            reqType: 'get',
            memorySize: 256,
            timeOut: 10,
        });
        // noticeGetOne Lambda create
        const noticeGetOneLambda = new makingLambdaConstruct_1.makingLambdaConstruct(this, 'noticeGetOne', {
            resourceName: 'notice',
            reqType: 'getOne',
            memorySize: 256,
            timeOut: 10,
        });
        // noticeDelete Lambda create
        const noticeDeleteLambda = new makingLambdaConstruct_1.makingLambdaConstruct(this, 'noticeDelete', {
            resourceName: 'notice',
            reqType: 'delete',
            memorySize: 256,
            timeOut: 10,
        });
        // grant permission
        props.noticeTable.grantWriteData(noticePostLambda.innerLambda);
        props.noticeTable.grantReadData(noticeGetLambda.innerLambda);
        props.noticeTable.grantReadData(noticeGetOneLambda.innerLambda);
        props.noticeTable.grantWriteData(noticeDeleteLambda.innerLambda);
        // add resource/method to api gateway
        const noticeRsc = props.apiGwConstruct.apiGW.root.addResource('notices');
        const belowNoticeRsc = noticeRsc.addResource('{id}');
        // if resource made by another construct
        // const noticeRsc = props.apiGwConstruct.apiGW.root.getResource('notices');
        // POST
        noticeRsc.addMethod('POST', new apiGateway.LambdaIntegration(noticePostLambda.innerLambda, { proxy: true }));
        noticePostLambda.innerLambda.grantInvoke(new aws_iam_1.ServicePrincipal('apigateway.amazonaws.com'));
        // GET
        noticeRsc.addMethod('GET', new apiGateway.LambdaIntegration(noticeGetLambda.innerLambda, { proxy: true }));
        // GET One
        belowNoticeRsc.addMethod('GET', new apiGateway.LambdaIntegration(noticeGetOneLambda.innerLambda, { proxy: true }));
        // Delete
        belowNoticeRsc.addMethod('DELETE', new apiGateway.LambdaIntegration(noticeDeleteLambda.innerLambda, { proxy: true }));
        // api gateway deploy - if needed, you can deploy manually on api gateway console.
        // const currntStage = 'stg';
        // const deployment = new apiGateway.Deployment(this, 'DevDeployment', { api:props.apiGwConstruct.apiGW });
        // const stage = new apiGateway.Stage(this, `${currntStage}_DevStage`, {
        //     deployment,
        //     stageName: `${currntStage}`,
        // });
        // props.apiGwConstruct.apiGW.deploymentStage = stage;
        // output
        new cdk.CfnOutput(this, 'noticePostLambdaName', {
            value: noticePostLambda.innerLambda.functionName,
            exportName: 'NoticePostLambdaName',
        });
        new cdk.CfnOutput(this, 'noticeGetLambdaName', {
            value: noticeGetLambda.innerLambda.functionName,
            exportName: 'NoticeGetLambdaName',
        });
        new cdk.CfnOutput(this, 'noticeGetOneLambdaName', {
            value: noticeGetOneLambda.innerLambda.functionName,
            exportName: 'NoticeGetOneLambdaName',
        });
        new cdk.CfnOutput(this, 'noticeDeleteLambdaName', {
            value: noticeDeleteLambda.innerLambda.functionName,
            exportName: 'NoticeDeleteLambdaName',
        });
    }
}
exports.NoticeLambdaConstruct = NoticeLambdaConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWNlLWxhbWJkYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vdGljZS1sYW1iZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBSW5DLDJDQUF1QztBQUd2Qyx5REFBeUQ7QUFDekQsaURBQXVEO0FBQ3ZELG1FQUFnRTtBQU9oRSxNQUFhLHFCQUFzQixTQUFRLHNCQUFTO0lBQ2hELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQiw4QkFBOEI7UUFDOUIsMkVBQTJFO1FBQzNFLHVGQUF1RjtRQUN2RiwyQ0FBMkM7UUFDM0MsZ0NBQWdDO1FBQ2hDLHVCQUF1QjtRQUN2Qix3Q0FBd0M7UUFDeEMsd0NBQXdDO1FBQ3hDLCtCQUErQjtRQUMvQixnREFBZ0Q7UUFDaEQsNEJBQTRCO1FBQzVCLFNBQVM7UUFDVCxNQUFNO1FBRU4sMkJBQTJCO1FBQzNCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ25FLFlBQVksRUFBRSxRQUFRO1lBQ3RCLE9BQU8sRUFBRSxNQUFNO1lBQ2YsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsRUFBRTtTQUNkLENBQUMsQ0FBQztRQUNILDBCQUEwQjtRQUMxQixNQUFNLGVBQWUsR0FBRyxJQUFJLDZDQUFxQixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDakUsWUFBWSxFQUFFLFFBQVE7WUFDdEIsT0FBTyxFQUFFLEtBQUs7WUFDZCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxFQUFFO1NBQ2QsQ0FBQyxDQUFDO1FBQ0gsNkJBQTZCO1FBQzdCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3ZFLFlBQVksRUFBRSxRQUFRO1lBQ3RCLE9BQU8sRUFBRSxRQUFRO1lB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LElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDOUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxZQUFZO1lBQ2xELFVBQVUsRUFBRSx3QkFBd0I7U0FDdkMsQ0FBQyxDQUFBO0lBRU4sQ0FBQztDQUNKO0FBOUdELHNEQThHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFwaUdXQ29uc3RydWN0IH0gZnJvbSAnLi4vaW5mcmEtY29uc3RydWN0cy9hcGlnYXRld2F5LWNvbnN0cnVjdC9hcGlnYXRld2F5LWNvbnN0cnVjdCc7XG5pbXBvcnQgKiBhcyBhcGlHYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCB7IFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IG1ha2luZ0xhbWJkYUNvbnN0cnVjdCB9IGZyb20gJy4vbWFraW5nTGFtYmRhQ29uc3RydWN0JztcblxuZXhwb3J0IGludGVyZmFjZSBkZGJDb25zdHJ1Y3RQcm9wcyB7XG4gICAgbm90aWNlVGFibGU6IGR5bmFtb2RiLlRhYmxlLFxuICAgIGFwaUd3Q29uc3RydWN0OiBBcGlHV0NvbnN0cnVjdCxcbn1cblxuZXhwb3J0IGNsYXNzIE5vdGljZUxhbWJkYUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGRkYkNvbnN0cnVjdFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgLy8gY3JlYXRlIG5vdGljZSBMYW1iZGEgLSBQT1NUXG4gICAgICAgIC8vIGNvbnN0IG5vdGljZVBvc3RMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdub3RpY2VQb3N0TGFtYmRhJywge1xuICAgICAgICAvLyAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcvLi4vLi4vbGFtYmRhL25vdGljZXMvcG9zdCcpKSxcbiAgICAgICAgLy8gICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNl9YLFxuICAgICAgICAvLyAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICAvLyAgICAgbWVtb3J5U2l6ZTogNTEyLFxuICAgICAgICAvLyAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNSksXG4gICAgICAgIC8vICAgICBmdW5jdGlvbk5hbWU6ICdub3RpY2VQb3N0TGFtYmRhJyxcbiAgICAgICAgLy8gICAgIGN1cnJlbnRWZXJzaW9uT3B0aW9uczoge1xuICAgICAgICAvLyAgICAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgICAgLy8gICAgICAgICByZXRyeUF0dGVtcHRzOiAyLFxuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgLy8gbm90aWNlUG9zdCBMYW1iZGEgY3JlYXRlXG4gICAgICAgIGNvbnN0IG5vdGljZVBvc3RMYW1iZGEgPSBuZXcgbWFraW5nTGFtYmRhQ29uc3RydWN0KHRoaXMsICdub3RpY2VQb3N0Jywge1xuICAgICAgICAgICAgcmVzb3VyY2VOYW1lOiAnbm90aWNlJyxcbiAgICAgICAgICAgIHJlcVR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIG1lbW9yeVNpemU6IDI1NixcbiAgICAgICAgICAgIHRpbWVPdXQ6IDEwLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gbm90aWNlR2V0IExhbWJkYSBjcmVhdGVcbiAgICAgICAgY29uc3Qgbm90aWNlR2V0TGFtYmRhID0gbmV3IG1ha2luZ0xhbWJkYUNvbnN0cnVjdCh0aGlzLCAnbm90aWNlR2V0Jywge1xuICAgICAgICAgICAgcmVzb3VyY2VOYW1lOiAnbm90aWNlJyxcbiAgICAgICAgICAgIHJlcVR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgbWVtb3J5U2l6ZTogMjU2LFxuICAgICAgICAgICAgdGltZU91dDogMTAsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBub3RpY2VHZXRPbmUgTGFtYmRhIGNyZWF0ZVxuICAgICAgICBjb25zdCBub3RpY2VHZXRPbmVMYW1iZGEgPSBuZXcgbWFraW5nTGFtYmRhQ29uc3RydWN0KHRoaXMsICdub3RpY2VHZXRPbmUnLCB7XG4gICAgICAgICAgICByZXNvdXJjZU5hbWU6ICdub3RpY2UnLFxuICAgICAgICAgICAgcmVxVHlwZTogJ2dldE9uZScsXG4gICAgICAgICAgICBtZW1vcnlTaXplOiAyNTYsXG4gICAgICAgICAgICB0aW1lT3V0OiAxMCxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIG5vdGljZURlbGV0ZSBMYW1iZGEgY3JlYXRlXG4gICAgICAgIGNvbnN0IG5vdGljZURlbGV0ZUxhbWJkYSA9IG5ldyBtYWtpbmdMYW1iZGFDb25zdHJ1Y3QodGhpcywgJ25vdGljZURlbGV0ZScsIHtcbiAgICAgICAgICAgIHJlc291cmNlTmFtZTogJ25vdGljZScsXG4gICAgICAgICAgICByZXFUeXBlOiAnZGVsZXRlJyxcbiAgICAgICAgICAgIG1lbW9yeVNpemU6IDI1NixcbiAgICAgICAgICAgIHRpbWVPdXQ6IDEwLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIGdyYW50IHBlcm1pc3Npb25cbiAgICAgICAgcHJvcHMubm90aWNlVGFibGUuZ3JhbnRXcml0ZURhdGEobm90aWNlUG9zdExhbWJkYS5pbm5lckxhbWJkYSk7XG4gICAgICAgIHByb3BzLm5vdGljZVRhYmxlLmdyYW50UmVhZERhdGEobm90aWNlR2V0TGFtYmRhLmlubmVyTGFtYmRhKTtcbiAgICAgICAgcHJvcHMubm90aWNlVGFibGUuZ3JhbnRSZWFkRGF0YShub3RpY2VHZXRPbmVMYW1iZGEuaW5uZXJMYW1iZGEpO1xuICAgICAgICBwcm9wcy5ub3RpY2VUYWJsZS5ncmFudFdyaXRlRGF0YShub3RpY2VEZWxldGVMYW1iZGEuaW5uZXJMYW1iZGEpO1xuXG4gICAgICAgIC8vIGFkZCByZXNvdXJjZS9tZXRob2QgdG8gYXBpIGdhdGV3YXlcbiAgICAgICAgY29uc3Qgbm90aWNlUnNjID0gcHJvcHMuYXBpR3dDb25zdHJ1Y3QuYXBpR1cucm9vdC5hZGRSZXNvdXJjZSgnbm90aWNlcycpO1xuICAgICAgICBjb25zdCBiZWxvd05vdGljZVJzYyA9IG5vdGljZVJzYy5hZGRSZXNvdXJjZSgne2lkfScpO1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgcmVzb3VyY2UgbWFkZSBieSBhbm90aGVyIGNvbnN0cnVjdFxuICAgICAgICAvLyBjb25zdCBub3RpY2VSc2MgPSBwcm9wcy5hcGlHd0NvbnN0cnVjdC5hcGlHVy5yb290LmdldFJlc291cmNlKCdub3RpY2VzJyk7XG5cbiAgICAgICAgLy8gUE9TVFxuICAgICAgICBub3RpY2VSc2MuYWRkTWV0aG9kKFxuICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgbmV3IGFwaUdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obm90aWNlUG9zdExhbWJkYS5pbm5lckxhbWJkYSwge3Byb3h5OiB0cnVlfSlcbiAgICAgICAgKTtcbiAgICAgICAgbm90aWNlUG9zdExhbWJkYS5pbm5lckxhbWJkYS5ncmFudEludm9rZShuZXcgU2VydmljZVByaW5jaXBhbCgnYXBpZ2F0ZXdheS5hbWF6b25hd3MuY29tJykpO1xuICAgICAgICAvLyBHRVRcbiAgICAgICAgbm90aWNlUnNjLmFkZE1ldGhvZChcbiAgICAgICAgICAgICdHRVQnLFxuICAgICAgICAgICAgbmV3IGFwaUdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obm90aWNlR2V0TGFtYmRhLmlubmVyTGFtYmRhLCB7cHJveHk6IHRydWV9KVxuICAgICAgICApO1xuICAgICAgICAvLyBHRVQgT25lXG4gICAgICAgIGJlbG93Tm90aWNlUnNjLmFkZE1ldGhvZChcbiAgICAgICAgICAgICdHRVQnLFxuICAgICAgICAgICAgbmV3IGFwaUdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obm90aWNlR2V0T25lTGFtYmRhLmlubmVyTGFtYmRhLCB7cHJveHk6IHRydWV9KVxuICAgICAgICApO1xuICAgICAgICAvLyBEZWxldGVcbiAgICAgICAgYmVsb3dOb3RpY2VSc2MuYWRkTWV0aG9kKFxuICAgICAgICAgICAgJ0RFTEVURScsXG4gICAgICAgICAgICBuZXcgYXBpR2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihub3RpY2VEZWxldGVMYW1iZGEuaW5uZXJMYW1iZGEsIHtwcm94eTogdHJ1ZX0pXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gYXBpIGdhdGV3YXkgZGVwbG95IC0gaWYgbmVlZGVkLCB5b3UgY2FuIGRlcGxveSBtYW51YWxseSBvbiBhcGkgZ2F0ZXdheSBjb25zb2xlLlxuICAgICAgICAvLyBjb25zdCBjdXJybnRTdGFnZSA9ICdzdGcnO1xuICAgICAgICAvLyBjb25zdCBkZXBsb3ltZW50ID0gbmV3IGFwaUdhdGV3YXkuRGVwbG95bWVudCh0aGlzLCAnRGV2RGVwbG95bWVudCcsIHsgYXBpOnByb3BzLmFwaUd3Q29uc3RydWN0LmFwaUdXIH0pO1xuICAgICAgICAvLyBjb25zdCBzdGFnZSA9IG5ldyBhcGlHYXRld2F5LlN0YWdlKHRoaXMsIGAke2N1cnJudFN0YWdlfV9EZXZTdGFnZWAsIHtcbiAgICAgICAgLy8gICAgIGRlcGxveW1lbnQsXG4gICAgICAgIC8vICAgICBzdGFnZU5hbWU6IGAke2N1cnJudFN0YWdlfWAsXG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyBwcm9wcy5hcGlHd0NvbnN0cnVjdC5hcGlHVy5kZXBsb3ltZW50U3RhZ2UgPSBzdGFnZTtcblxuICAgICAgICAvLyBvdXRwdXRcbiAgICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ25vdGljZVBvc3RMYW1iZGFOYW1lJywge1xuICAgICAgICAgICAgdmFsdWU6IG5vdGljZVBvc3RMYW1iZGEuaW5uZXJMYW1iZGEuZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgZXhwb3J0TmFtZTogJ05vdGljZVBvc3RMYW1iZGFOYW1lJyxcbiAgICAgICAgfSk7XG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdub3RpY2VHZXRMYW1iZGFOYW1lJywge1xuICAgICAgICAgICAgdmFsdWU6IG5vdGljZUdldExhbWJkYS5pbm5lckxhbWJkYS5mdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICBleHBvcnROYW1lOiAnTm90aWNlR2V0TGFtYmRhTmFtZScsXG4gICAgICAgIH0pO1xuICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnbm90aWNlR2V0T25lTGFtYmRhTmFtZScsIHtcbiAgICAgICAgICAgIHZhbHVlOiBub3RpY2VHZXRPbmVMYW1iZGEuaW5uZXJMYW1iZGEuZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgZXhwb3J0TmFtZTogJ05vdGljZUdldE9uZUxhbWJkYU5hbWUnLFxuICAgICAgICB9KTtcbiAgICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ25vdGljZURlbGV0ZUxhbWJkYU5hbWUnLCB7XG4gICAgICAgICAgICB2YWx1ZTogbm90aWNlRGVsZXRlTGFtYmRhLmlubmVyTGFtYmRhLmZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgIGV4cG9ydE5hbWU6ICdOb3RpY2VEZWxldGVMYW1iZGFOYW1lJyxcbiAgICAgICAgfSlcblxuICAgIH1cbn0iXX0=