import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { CONSTANTS } from '../../../config/shared';
import * as cdk from 'aws-cdk-lib';
// import * as cognito from 'aws-cdk-lib/aws-cognito';

// declare const cdkDemoWeb: apigateway.Resource;

export interface ApiGWConstructProps {
    // cognitoUserPool: cognito.UserPool,
    cfDomainName: string,
}

export class ApiGWConstruct extends Construct {

    public apiGW: apiGateway.RestApi;

    constructor(scope: Construct, id: string, props: ApiGWConstructProps) {
        super(scope, id);

        // Create api gateway
        this.apiGW = new apiGateway.RestApi(this, 'apiGateway', {
            description: 'apigateway for web app',
            restApiName: `${CONSTANTS.PROJECT_NAME}-apiGateway`,
            // deployOptions: {
            //     stageName: 'prd',
            // },
            deploy: false,
            endpointTypes: [apiGateway.EndpointType.REGIONAL],
            // defaultCorsPreflightOptions: {
            //     allowHeaders: [
            //         'Content-Type',
            //         'X-Amz-Date',
            //         'Authorization',
            //         'X-Api-Key',
            //     ],
            //     allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            //     allowCredentials: true,
            //     // allowOrigins: [props.cfDomainName],
            //     allowOrigins: ['*'],
            // }
        });
        
        // Authoirizer
        // const auth = new apigateway.CognitoUserPoolsAuthorizer(this, `${CONSTANTS.PROJECT_NAME}Authorizer`, {
        //     cognitoUserPools: [props.cognitoUserPool],
        // });

        // const webapps = this.apiGW.root.addResource('webapps');
        // webapps.addMethod('GET', new apigateway.HttpIntegration('http://amazon.com'), {
        //     authorizer: auth,
        //     authorizationType: apigateway.AuthorizationType.COGNITO,
        // });

        // output
        new cdk.CfnOutput(this, `${CONSTANTS.PROJECT_NAME}-apiGw`, {
            exportName: `${CONSTANTS.PROJECT_NAME}-apiGw`,
            value: this.apiGW.restApiId,
        });

        new cdk.CfnOutput(this, `${CONSTANTS.PROJECT_NAME}-apiGw-root-id`, {
            exportName: `${CONSTANTS.PROJECT_NAME}-apiGw-root-id`,
            value: this.apiGW.root.resourceId,
        })
    }
}