import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { CONSTANTS } from '../../../config/shared';
import * as cdk from 'aws-cdk-lib';

export interface ApiGWConstructProps {
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
            endpointTypes: [apiGateway.EndpointType.REGIONAL],
            // deployOptions: {
            //     stageName: 'prd',
            // },
            // deploy: false,
        });

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