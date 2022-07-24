import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export type requestType = 'post' | 'put' | 'get' | 'delete' | 'getOne';

export interface makingLambdaConstructProps {
    resourceName: string,
    reqType: requestType,
    memorySize: number,
    timeOut: number,
}

function capitalizeString(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export class makingLambdaConstruct extends Construct {
    public innerLambda: lambda.Function;

    constructor(scope: Construct, id: string, props: makingLambdaConstructProps) {
        super(scope, id);

        const capRscName = capitalizeString(props.reqType);
        const rscPathName = props.resourceName.concat('s');

        this.innerLambda = new lambda.Function(this, `${props.resourceName}${capRscName}Lambda`, {
            code: lambda.Code.fromAsset(path.join(__dirname, `/../../lambda/${rscPathName}/${props.reqType}`)),
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            memorySize: props.memorySize,
            timeout: cdk.Duration.seconds(props.timeOut),
            functionName: `${props.resourceName}${capRscName}Lambda`,
            currentVersionOptions: {
                removalPolicy: RemovalPolicy.DESTROY,
                retryAttempts: 2,
            },
        });
    }
}