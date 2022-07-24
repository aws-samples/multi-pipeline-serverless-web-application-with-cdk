import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export interface insertDataProps {
    noticeTable: dynamodb.Table,
}

// insert 3 datas to dynamoDB after Table created
export class InsertDatasToDdbConstruct extends Construct {
    constructor(scope: Construct, id: string, props: insertDataProps) {
        super(scope, id);

        // create lambda
        const ddbInitLambda = new lambda.Function(this, 'ddbInitLambda', {
            code: lambda.Code.fromAsset(path.join(__dirname, '/../../lambda/notices/setData')),
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            memorySize: 256,
            timeout: cdk.Duration.seconds(60),
            functionName: 'ddbInitLambda',
            currentVersionOptions: {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retryAttempts: 2,
            }
        });

        // grant permission
        props.noticeTable.grantWriteData(ddbInitLambda);

        // run lambda on create
        const lambdaTrigger = new cr.AwsCustomResource(this, 'ddbLambdaTrigger', {
            policy: cr.AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({
                actions: ['lambda:InvokeFunction'],
                effect: iam.Effect.ALLOW,
                resources: [ddbInitLambda.functionArn],
            })]),
            timeout: cdk.Duration.minutes(5),
            onCreate: {
                service: 'Lambda',
                action: 'invoke',
                parameters: {
                    FunctionName: ddbInitLambda.functionName,
                    InvocationType: 'Event',
                },
                physicalResourceId: cr.PhysicalResourceId.of('JobSenderTriggerPhysicalId'),
            },
            // onUpdate: {
            //     service: 'Lambda',
            //     action: 'invoke',
            //     parameters: {
            //         FunctionName: ddbInitLambda.functionName,
            //         InvocationType: 'Event',
            //     },
            //     physicalResourceId: cr.PhysicalResourceId.of('JobSenderTriggerPhysicalId'),
            // },
        })
    }
}