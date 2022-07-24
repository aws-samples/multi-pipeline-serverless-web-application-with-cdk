import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { ApiGWConstruct } from '../infra-constructs/apigateway-construct/apigateway-construct';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { makingLambdaConstruct } from './makingLambdaConstruct';

export interface ddbConstructProps {
    noticeTable: dynamodb.Table,
    apiGwConstruct: ApiGWConstruct,
}

export class NoticeLambdaConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ddbConstructProps) {
        super(scope, id);

        // noticePost Lambda create
        const noticePostLambda = new makingLambdaConstruct(this, 'noticePost', {
            resourceName: 'notice',
            reqType: 'post',
            memorySize: 256,
            timeOut: 10,
        });
        // noticeGet Lambda create
        const noticeGetLambda = new makingLambdaConstruct(this, 'noticeGet', {
            resourceName: 'notice',
            reqType: 'get',
            memorySize: 256,
            timeOut: 10,
        });
        // noticeGetOne Lambda create
        const noticeGetOneLambda = new makingLambdaConstruct(this, 'noticeGetOne', {
            resourceName: 'notice',
            reqType: 'getOne',
            memorySize: 256,
            timeOut: 10,
        });
        // noticeDelete Lambda create
        const noticeDeleteLambda = new makingLambdaConstruct(this, 'noticeDelete', {
            resourceName: 'notice',
            reqType: 'delete',
            memorySize: 256,
            timeOut: 10,
        })

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
        noticeRsc.addMethod(
            'POST',
            new apiGateway.LambdaIntegration(noticePostLambda.innerLambda, {proxy: true})
        );
        noticePostLambda.innerLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));
        // GET
        noticeRsc.addMethod(
            'GET',
            new apiGateway.LambdaIntegration(noticeGetLambda.innerLambda, {proxy: true})
        );
        // GET One
        belowNoticeRsc.addMethod(
            'GET',
            new apiGateway.LambdaIntegration(noticeGetOneLambda.innerLambda, {proxy: true})
        );
        // Delete
        belowNoticeRsc.addMethod(
            'DELETE',
            new apiGateway.LambdaIntegration(noticeDeleteLambda.innerLambda, {proxy: true})
        );

        // activate cors
        noticeRsc.addCorsPreflight({
            allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
            allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowCredentials: true,
            allowOrigins: ['*'],
        });
        belowNoticeRsc.addCorsPreflight({
            allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
            allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowCredentials: true,
            allowOrigins: ['*'],
        });

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
        })

    }
}

export function addCorsOptions(apiResource: apiGateway.IResource) {
    apiResource.addMethod('OPTIONS', new apiGateway.MockIntegration({
        integrationResponses: [{
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                'method.response.header.Access-Control-Allow-Origin': "'*'",
                'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PATCH,PUT,POST,DELETE'",
            },
        }],
        passthroughBehavior: apiGateway.PassthroughBehavior.NEVER,
        requestTemplates: {
            "application/json": "{\"statusCode\": 200}"
        },
    }), {
        methodResponses: [{
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Headers': true,
                'method.response.header.Access-Control-Allow-Methods': true,
                'method.response.header.Access-Control-Allow-Credentials': false,
                'method.response.header.Access-Control-Allow-Origin': true,
            },
        }]
    })
}