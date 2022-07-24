import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
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
    public apiGwIRest: apiGateway.IRestApi;
    public boardGetLambda: makingLambdaConstruct;
    public boardPostLambda: makingLambdaConstruct;
    public boardDeleteLambda: makingLambdaConstruct;

    constructor(scope: Construct, id: string, props: rdsConstructProps) {
        super(scope, id);

        this.apiGwIRest = apiGateway.RestApi.fromRestApiAttributes(this, 'RestApi', {
            restApiId: cdk.Fn.importValue(`${CONSTANTS.PROJECT_NAME}-apiGw`),
            rootResourceId: cdk.Fn.importValue(`${CONSTANTS.PROJECT_NAME}-apiGw-root-id`),
        });

        // boardGet Lambda create
        this.boardGetLambda = new makingLambdaConstruct(this, 'boardGet', {
            resourceName: 'board',
            reqType: 'get',
            memorySize: 256,
            timeOut: 10
        }, {rdsConstruct: props.rdsConstruct});
        // grant to DB Credential
        props.rdsConstruct.dbCredentialSecret.grantRead(this.boardGetLambda.innerLambda);

        // boardPost Lambda create
        this.boardPostLambda = new makingLambdaConstruct(this, 'boardPost', {
            resourceName: 'board',
            reqType: 'post',
            memorySize: 256,
            timeOut: 20,
        }, {rdsConstruct: props.rdsConstruct});
        // grant to DB Credential
        props.rdsConstruct.dbCredentialSecret.grantRead(this.boardPostLambda.innerLambda);

        // boardDelete Lambda create
        this.boardDeleteLambda = new makingLambdaConstruct(this, 'boardDelete', {
            resourceName: 'board',
            reqType: 'delete',
            memorySize: 256,
            timeOut: 20,
        }, {rdsConstruct: props.rdsConstruct});
        // grant to DB Credential
        props.rdsConstruct.dbCredentialSecret.grantRead(this.boardDeleteLambda.innerLambda);

        // create resource
        this.boardRsc = this.apiGwIRest.root.addResource('boards');
        const belowBoardRds = this.boardRsc.addResource('{id}');

        // add GET method
        this.boardRsc.addMethod(
            'GET',
            new apiGateway.LambdaIntegration(this.boardGetLambda.innerLambda, {proxy: true})
        );
        // add POST method
        this.boardRsc.addMethod(
            'POST',
            new apiGateway.LambdaIntegration(this.boardPostLambda.innerLambda, {proxy: true})
        );
        // add DELETE method
        belowBoardRds.addMethod(
            'DELETE',
            new apiGateway.LambdaIntegration(this.boardDeleteLambda.innerLambda, {proxy: true})
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

        // const currntStage = 'prod';
        const currntStage = 'v1';
        const deployment = new apiGateway.Deployment(this, 'Deployment-'+new Date().toISOString, {
            api: this.apiGwIRest,
            retainDeployments: true,
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        deployment.resource.stageName = `${currntStage}`;
        // apiGwIRest.deploymentStage = stage;

        // grant permission to api gateway method
        this.boardGetLambda.innerLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));
        this.boardPostLambda.innerLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));
        this.boardDeleteLambda.innerLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));        

        new cdk.CfnOutput(this, 'devteam2RestApiId', {
            value: this.apiGwIRest.restApiId,
            exportName: 'devteam2RestApiId',
        }); 
    };
}