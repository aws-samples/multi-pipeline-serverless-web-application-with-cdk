import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export class LambdaLocalTest extends Construct {
    constructor(scope: Construct, id: string, props?: any) {
        super(scope, id);

        const innerLambda = new lambda.Function(this, 'testLambda', {
            code: lambda.Code.fromAsset(path.join(__dirname, `/../../lambda/lambdaLocalTest`)),
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            memorySize: 256,
            timeout: cdk.Duration.seconds(20),
            functionName: 'lambdaLocalTest',
            currentVersionOptions: {
                removalPolicy: RemovalPolicy.DESTROY,
                retryAttempts: 2,
            },
        });
    }
}