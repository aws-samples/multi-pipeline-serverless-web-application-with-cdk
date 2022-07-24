import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import { RdsConstruct } from '../rds-construct/rds-construct';
import { CONSTANTS } from '../../config/shared';

export type requestType = 'post' | 'put' | 'get' | 'delete' | 'getOne';

export interface MakingLambdaConstructProps {
    resourceName: string,
    reqType: requestType,
    memorySize: number,
    timeOut: number,
}

export interface RdsConstructProps {
    rdsConstruct: RdsConstruct,
}

function capitalizeString(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export class makingLambdaConstruct extends Construct {
    // public innerLambda: lambda.Function;
    public innerLambda: nodeLambda.NodejsFunction;
    
    constructor(scope: Construct, id: string,
        props: MakingLambdaConstructProps, rdsProps: RdsConstructProps) {
        super(scope, id);

        const capRscName = capitalizeString(props.reqType);
        const rscPathName = props.resourceName.concat('s');

        this.innerLambda = new nodeLambda.NodejsFunction(this, `${props.resourceName}${capRscName}Lambda`, {
            entry: path.join(__dirname, `/../../lambda/${rscPathName}/${props.reqType}/index.js`),
            runtime: lambda.Runtime.NODEJS_16_X,
            memorySize: props.memorySize,
            timeout: cdk.Duration.seconds(props.timeOut),
            functionName: `${props.resourceName}${capRscName}Lambda`,
            currentVersionOptions: {
                removalPolicy: RemovalPolicy.DESTROY,
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
    }
}