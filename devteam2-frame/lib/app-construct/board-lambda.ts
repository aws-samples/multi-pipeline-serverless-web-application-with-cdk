import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import { makingLambdaConstruct } from './makingLambdaConstruct';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { CONSTANTS } from '../../config/shared';
import { RdsConstruct } from '../rds-construct/rds-construct';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export interface rdsConstructProps {
    rdsConstruct: RdsConstruct,
}

export class BoardLambdaConstruct extends Construct {
    public boardRsc: apiGateway.Resource;

    constructor(scope: Construct, id: string, props: rdsConstructProps) {
        super(scope, id);

        const apiGwIRest = apiGateway.RestApi.fromRestApiAttributes(this, 'RestApi', {
            restApiId: cdk.Fn.importValue(`${CONSTANTS.PROJECT_NAME}-apiGw`),
            rootResourceId: cdk.Fn.importValue(`${CONSTANTS.PROJECT_NAME}-apiGw-root-id`),
        });

        // boardGet Lambda create
        const boardGetLambda = new makingLambdaConstruct(this, 'boardGet', {
            resourceName: 'board',
            reqType: 'get',
            memorySize: 256,
            timeOut: 10
        }, {rdsConstruct: props.rdsConstruct});
        // grant to DB Credential
        props.rdsConstruct.dbCredentialSecret.grantRead(boardGetLambda.innerLambda);

        // boardPost Lambda create
        const boardPostLambda = new makingLambdaConstruct(this, 'boardPost', {
            resourceName: 'board',
            reqType: 'post',
            memorySize: 256,
            timeOut: 20,
        }, {rdsConstruct: props.rdsConstruct});
        // grant to DB Credential
        props.rdsConstruct.dbCredentialSecret.grantRead(boardGetLambda.innerLambda);

        // boardDelete Lambda create
        const boardDeleteLambda = new makingLambdaConstruct(this, 'boardDelete', {
            resourceName: 'board',
            reqType: 'delete',
            memorySize: 256,
            timeOut: 20,
        }, {rdsConstruct: props.rdsConstruct});
        // grant to DB Credential

        // create resource
        this.boardRsc = apiGwIRest.root.addResource('boards');
        const belowBoardRds = this.boardRsc.addResource('{id}');

        // add GET method
        this.boardRsc.addMethod(
            'GET',
            new apiGateway.LambdaIntegration(boardGetLambda.innerLambda, {proxy: true})
        );
        // add POST method
        this.boardRsc.addMethod(
            'POST',
            new apiGateway.LambdaIntegration(boardPostLambda.innerLambda, {proxy: true})
        );
        // add DELETE method
        belowBoardRds.addMethod(
            'DELETE',
            new apiGateway.LambdaIntegration(boardDeleteLambda.innerLambda, {proxy: true})
        );

        // activate cors
        this.boardRsc.addCorsPreflight({
            allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
            allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowCredentials: true,
            allowOrigins: ['*'],
        })
        belowBoardRds.addCorsPreflight({
            allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
            allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowCredentials: true,
            allowOrigins: ['*'],
        })

        // api gateway deploy 1st attempt success
        const currntStage = 'stg';
        const deployment = new apiGateway.Deployment(this, 'Deployment',
         { api:apiGwIRest });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        deployment.resource.stageName = `${currntStage}`;
        // const stage = new apiGateway.Stage(this, `${currntStage}_stage`, {
        //     deployment,
        //     stageName: `${currntStage}`,
        // });
        // apiGwIRest.deploymentStage = stage;

        // grant permission to api gateway method
        boardGetLambda.innerLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));
        boardPostLambda.innerLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));
        boardDeleteLambda.innerLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));
    };
}