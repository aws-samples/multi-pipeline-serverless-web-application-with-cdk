import * as cdk from 'aws-cdk-lib';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { BoardLambdaConstruct } from '../app-construct/board-lambda';

export interface deployApiGwConstructProps {
    boardLambda: BoardLambdaConstruct,
}

export class DeployApiGwConstruct extends Construct {
    constructor(scope: Construct, id: string, props: deployApiGwConstructProps) {
        super(scope, id);

        const deployApiGwLambda = new nodeLambda.NodejsFunction(this, 'deployApiGwLambda', {
            entry: path.join(__dirname, '/../../lambda/deployApiGw/index.js'),
            runtime: lambda.Runtime.NODEJS_16_X,
            memorySize: 256,
            timeout: cdk.Duration.minutes(2),
            functionName: 'deployApiGw',
            currentVersionOptions: {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retryAttempts: 2,
            },
            environment: {
                RESTAPI_ID: props.boardLambda.apiGwIRest.restApiId,
                STAGE: 'prod',
            }
        });

        // permission for api gateway create deployment
        const apiGwPolicy = new iam.PolicyStatement({
            actions: ['apigateway:*'],
            resources: ['arn:aws:apigateway:*::/*'],
        });
        deployApiGwLambda.role?.attachInlinePolicy(
            new iam.Policy(this, 'apiGwDeployPolicy', {
                statements: [apiGwPolicy],
            })
        );

        // run lambda on Create and update
        const lambdaTrigger = new cr.AwsCustomResource(this, 'apiGwDeployLambdaTrigger', {
            policy: cr.AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({
                actions: ['lambda:InvokeFunction'],
                effect: iam.Effect.ALLOW,
                resources: [deployApiGwLambda.functionArn]
            })]),
            timeout: cdk.Duration.minutes(5),
            onCreate: {
                service: 'Lambda',
                action: 'invoke',
                parameters: {
                    FunctionName: deployApiGwLambda.functionName,
                    InvocationType: 'Event',
                },
                physicalResourceId: cr.PhysicalResourceId.of('JobSenderTriggerPhysicalId')
            },
            onUpdate: {
                service: 'Lambda',
                action: 'invoke',
                parameters: {
                    FunctionName: deployApiGwLambda.functionName,
                    InvocationType: 'Event',
                },
                physicalResourceId: cr.PhysicalResourceId.of('JobSenderTriggerPhysicalId')
            },
        });

        lambdaTrigger.node.addDependency(props.boardLambda.boardGetLambda.innerLambda);
        lambdaTrigger.node.addDependency(props.boardLambda.boardPostLambda.innerLambda);
        lambdaTrigger.node.addDependency(props.boardLambda.boardDeleteLambda.innerLambda);
    }
}