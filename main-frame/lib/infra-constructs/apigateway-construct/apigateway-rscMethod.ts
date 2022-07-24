import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CONSTANTS } from '../../../config/shared';
import * as cdk from 'aws-cdk-lib';

export interface ApiGWContructProps {
    apiGW: apiGateway.RestApi,
}

export class ApiRscMethod extends Construct {
    public noticeRsc: apiGateway.Resource;

    constructor(scope: Construct, id: string, props: ApiGWContructProps) {
        super(scope, id);

        const accountId = cdk.Stack.of(this).account; // or this.account

        // reference imported lambda. below function can modify/add existing roles.
        const exLambda = lambda.Function.fromFunctionAttributes(this, 'exLambda', {
            functionArn: `arn:aws:lambda:${CONSTANTS.REGION}:${accountId}:function:helloworld`,
            sameEnvironment: true,
        })

        // create resource
        this.noticeRsc = props.apiGW.root.addResource('temporary');
        // add method
        this.noticeRsc.addMethod(
            'GET',
            new apiGateway.LambdaIntegration(exLambda, {proxy: true})
        );
        // exLambda.addPermission();
        exLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));

        this.noticeRsc.addCorsPreflight({
            allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
            allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowCredentials: true,
            allowOrigins: ['*'],
        });

        // api gateway deploy
        // const currntStage = 'stg';
        // const deployment = new apiGateway.Deployment(this, 'Deployment', {
        //     api:props.apiGW,
        //     retainDeployments: true,
        // });
        // const stage = new apiGateway.Stage(this, `${currntStage}_stage`, {
        //     deployment,
        //     stageName: `${currntStage}`,
        // });
        // props.apiGW.deploymentStage = stage;

        // api gateway output

        new cdk.CfnOutput(this, 'apiGWUrl', {
            value: props.apiGW.url,
            exportName: 'ApiGWUrl',
        });

        new cdk.CfnOutput(this, 'deploymentId', {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            value: props.apiGW.latestDeployment?.deploymentId,
            exportName: 'deploymentId',
        }); 
    }
}