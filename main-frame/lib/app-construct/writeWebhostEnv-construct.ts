import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

export interface writeWebhostEnvProps {
    bucket: s3.Bucket,
    apiGW: apiGateway.RestApi,
}

export class WriteWebhostEnvConstruct extends Construct {
    constructor(scope: Construct, id: string, props: writeWebhostEnvProps) {
        super(scope, id);

        const writeEnvLambda = new lambda.Function(this, 'writeEnvLambda', {
            code: lambda.Code.fromAsset(path.join(__dirname, '/../../lambda/writeToS3')),
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            memorySize: 256,
            timeout: cdk.Duration.seconds(60),
            functionName: 'writeEnvToS3Lambda',
            currentVersionOptions: {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retryAttempts: 2,
            },
            environment: {
                BUCKET_NAME: props.bucket.bucketName,
                API_URL: props.apiGW.url,
            }
        });

        // grant permission to S3
        props.bucket.grantWrite(writeEnvLambda);

        // run lambda on create
        const lambdaTrigger = new cr.AwsCustomResource(this, 'writeEnvLambdaTrigger', {
            policy: cr.AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({
                actions: ['lambda:InvokeFunction'],
                effect: iam.Effect.ALLOW,
                resources: [writeEnvLambda.functionArn],
            })]),
            timeout: cdk.Duration.minutes(5),
            onCreate: {
                service: 'Lambda',
                action: 'invoke',
                
                parameters: {
                    FunctionName: writeEnvLambda.functionName,
                    InvocationType: 'Event',
                },
                physicalResourceId: cr.PhysicalResourceId.of('JobSenderTriggerPysicalId'),
            },
            // onUpdate: {
            //     service: 'Lambda',
            //     action: 'invoke',
            //     parameters: {
            //         FunctionName: writeEnvLambda.functionName,
            //         InvocationType: 'Event',
            //     },
            //     physicalResourceId: cr.PhysicalResourceId.of('JobSenderTriggerPhysicalId'),
            // },
        })
    }
}