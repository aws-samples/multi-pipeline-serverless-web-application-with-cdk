import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGWConstruct } from '../lib/infra-constructs/apigateway-construct/apigateway-construct';
import { ApiRscMethod } from '../lib/infra-constructs/apigateway-construct/apigateway-rscMethod';
// import { CognitoConstruct } from '../lib/constructs-infra/cognito-construct/cognito-construct';
import { S3WebhostConstruct } from '../lib/infra-constructs/s3-webhost-construct/s3-webhost-construct';
import * as cdk from 'aws-cdk-lib';
import { CONSTANTS } from '../config/shared';
import { WriteWebhostEnvConstruct } from '../lib/app-construct/writeWebhostEnv-construct';
import { LambdaLocalTest } from '../lib/app-construct/lambdaLocalTest';

export class MainFrameStack extends Stack {
  public readonly apiGwConstruct: ApiGWConstruct;
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const accountId = cdk.Stack.of(this).account; // or this.account

    // Making S3 Bucket for Web Hosting
    const s3Webhost = new S3WebhostConstruct(this, 'S3Webhost', {
      buckName: `${CONSTANTS.PROJECT_NAME.toLowerCase()}-${accountId}`, // Modify with your bucketName
    });

    // const cognitoUserPools = new CognitoConstruct(this, 'CognitoUserPool',{});

    // Making API Gateway
    this.apiGwConstruct = new ApiGWConstruct(this, 'ApiGateway', {
      cfDomainName: s3Webhost.distribution.distributionDomainName, // for CORS
    });
    
    // Resource and Method under API Gateway
    const apiRscMethod = new ApiRscMethod(this, 'apiRdcMethod', {
      apiGW: this.apiGwConstruct.apiGW,
      // cognitoUserPool: cognitoUserPools.userPool,
    });

    const writeWebhostEnvConstruct = new WriteWebhostEnvConstruct(this, 'writeToS3', {
      bucket: s3Webhost.cDKDemoBucket,
      apiGW: this.apiGwConstruct.apiGW,
    });

    new LambdaLocalTest(this, 'lambdaLocalTest', {});
  }
}
