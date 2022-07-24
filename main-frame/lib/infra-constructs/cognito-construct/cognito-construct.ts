import { Construct } from "constructs";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { RemovalPolicy } from "aws-cdk-lib";
import { CONSTANTS } from "../../../config/shared";

// You can extend if you want use cognito access
export class CognitoConstruct extends Construct {
    public userPool: cognito.UserPool;

    constructor(scope: Construct, id: string, props?: any) {
        super(scope, id);

        // making userPool
        this.userPool = new cognito.UserPool(this, 'UserPool', {
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            passwordPolicy: {
                minLength: 6,
                requireLowercase: true,
                requireUppercase: false,
                requireDigits: true,
                requireSymbols: true,
            },
            removalPolicy: RemovalPolicy.DESTROY,
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: false,
                }
            },
            userPoolName: `${CONSTANTS.PROJECT_NAME}`,
            // userPoolName: '12345',
        });

        // for finding password, sign-in, etc.
        const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
            userPool: this.userPool,
            authFlows: {
                userSrp: true,  // secure remote password
            },
            supportedIdentityProviders: [
                cognito.UserPoolClientIdentityProvider.COGNITO,
            ]
        });

        this.userPool.addDomain(`${CONSTANTS.PROJECT_NAME}Domain`, {
            cognitoDomain: {
                // domainPrefix:  `${CONSTANTS.PROJECT_NAME}-app`,
                domainPrefix:  `${CONSTANTS.PROJECT_NAME.toLowerCase()}-app`,
            },
        });

        // for grant accessing aws resources
        // const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
        //     allowUnauthenticatedIdentities: true,
        //     cognitoIdentityProviders: [
        //         {
        //             clientId: userPoolClient.userPoolClientId,
        //             providerName: this.userPool.userPoolProviderName,
        //         }
        //     ]
        // });
    }

}