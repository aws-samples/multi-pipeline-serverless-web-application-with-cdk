import * as cdk from 'aws-cdk-lib';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { RdsConstruct } from '../rds-construct/rds-construct';
import { CONSTANTS } from '../../config/shared';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambdaTrigger from 'aws-cdk-lib/triggers';

export interface RdsConstructProps {
    rdsConstruct: RdsConstruct,
}

export class CreateTableLmabdaConstruct extends Construct{
    constructor(scope: Construct, id: string, rdsProps: RdsConstructProps) {
        super(scope, id);

        const createTableLambda = new nodeLambda.NodejsFunction(this, 'createTableLambda', {
            entry: path.join(__dirname, '/../../lambda/boards/createTable/index.js'),
            runtime: lambda.Runtime.NODEJS_16_X,
            memorySize: 256,
            timeout: cdk.Duration.minutes(2),
            functionName: 'boardCreateTableLambda',
            currentVersionOptions: {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retryAttempts: 2,
            },
            vpc: rdsProps.rdsConstruct.vpc,
            role: rdsProps.rdsConstruct.iamRoleForLambda,
            securityGroups: [rdsProps.rdsConstruct.lambdaToProxySg],
            environment: {
                PROXY_ENDPOINT: rdsProps.rdsConstruct.proxy.endpoint,
                RDS_SECRET_NAME: 'db-credentials',
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
                DB_NAME: `${CONSTANTS.PROJECT_NAME.toLowerCase()}`
            },
            bundling: {
                nodeModules: ['mysql2'],
            }
        });

        // run lambda on Create
        const lambdaTrigger = new cr.AwsCustomResource(this, 'LambdaTrigger', {
            policy: cr.AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({
                actions: ['lambda:InvokeFunction'],
                effect: iam.Effect.ALLOW,
                resources: [createTableLambda.functionArn]
            })]),
            timeout: cdk.Duration.minutes(10),
            onCreate: {
                service: 'Lambda',
                action: 'invoke',
                parameters: {
                    FunctionName: createTableLambda.functionName,
                    InvocationType: 'Event'
                },
                physicalResourceId: cr.PhysicalResourceId.of('JobSenderTriggerPhysicalId')
            },
            // if need to update
            // onUpdate: {
            //     service: 'Lambda',
            //     action: 'invoke',
            //     parameters: {
            //         FunctionName: createTableLambda.functionName,
            //         InvocationType: 'Event'
            //     },
            //     physicalResourceId: cr.PhysicalResourceId.of('JobSenderTriggerPhysicalId')
            // },
        });
        // lambdaTrigger.node.addDependency()
    }
}