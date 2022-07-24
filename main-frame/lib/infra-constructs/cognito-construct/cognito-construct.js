"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoConstruct = void 0;
const constructs_1 = require("constructs");
const cognito = require("aws-cdk-lib/aws-cognito");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const shared_1 = require("../../../config/shared");
// You can extend if you want use cognito access
class CognitoConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
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
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
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
            userPoolName: `${shared_1.CONSTANTS.PROJECT_NAME}`,
        });
        // for finding password, sign-in, etc.
        const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
            userPool: this.userPool,
            authFlows: {
                userSrp: true,
            },
            supportedIdentityProviders: [
                cognito.UserPoolClientIdentityProvider.COGNITO,
            ]
        });
        this.userPool.addDomain(`${shared_1.CONSTANTS.PROJECT_NAME}Domain`, {
            cognitoDomain: {
                // domainPrefix:  `${CONSTANTS.PROJECT_NAME}-app`,
                domainPrefix: `${shared_1.CONSTANTS.PROJECT_NAME.toLowerCase()}-app`,
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
exports.CognitoConstruct = CognitoConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2duaXRvLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBdUM7QUFDdkMsbURBQW1EO0FBQ25ELDZDQUE0QztBQUM1QyxtREFBbUQ7QUFFbkQsZ0RBQWdEO0FBQ2hELE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFHM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFXO1FBQ2pELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkQsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVTtZQUNuRCxjQUFjLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLENBQUM7Z0JBQ1osZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLGNBQWMsRUFBRSxJQUFJO2FBQ3ZCO1lBQ0QsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGFBQWEsRUFBRTtnQkFDWCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxLQUFLLEVBQUUsSUFBSTthQUNkO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRTtvQkFDSCxRQUFRLEVBQUUsSUFBSTtvQkFDZCxPQUFPLEVBQUUsS0FBSztpQkFDakI7YUFDSjtZQUNELFlBQVksRUFBRSxHQUFHLGtCQUFTLENBQUMsWUFBWSxFQUFFO1NBRTVDLENBQUMsQ0FBQztRQUVILHNDQUFzQztRQUN0QyxNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3RFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixTQUFTLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLElBQUk7YUFDaEI7WUFDRCwwQkFBMEIsRUFBRTtnQkFDeEIsT0FBTyxDQUFDLDhCQUE4QixDQUFDLE9BQU87YUFDakQ7U0FDSixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLGtCQUFTLENBQUMsWUFBWSxRQUFRLEVBQUU7WUFDdkQsYUFBYSxFQUFFO2dCQUNYLGtEQUFrRDtnQkFDbEQsWUFBWSxFQUFHLEdBQUcsa0JBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE1BQU07YUFDL0Q7U0FDSixDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsMkVBQTJFO1FBQzNFLDRDQUE0QztRQUM1QyxrQ0FBa0M7UUFDbEMsWUFBWTtRQUNaLHlEQUF5RDtRQUN6RCxnRUFBZ0U7UUFDaEUsWUFBWTtRQUNaLFFBQVE7UUFDUixNQUFNO0lBQ1YsQ0FBQztDQUVKO0FBOURELDRDQThEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3kgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENPTlNUQU5UUyB9IGZyb20gXCIuLi8uLi8uLi9jb25maWcvc2hhcmVkXCI7XG5cbi8vIFlvdSBjYW4gZXh0ZW5kIGlmIHlvdSB3YW50IHVzZSBjb2duaXRvIGFjY2Vzc1xuZXhwb3J0IGNsYXNzIENvZ25pdG9Db25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgIHB1YmxpYyB1c2VyUG9vbDogY29nbml0by5Vc2VyUG9vbDtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogYW55KSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgLy8gbWFraW5nIHVzZXJQb29sXG4gICAgICAgIHRoaXMudXNlclBvb2wgPSBuZXcgY29nbml0by5Vc2VyUG9vbCh0aGlzLCAnVXNlclBvb2wnLCB7XG4gICAgICAgICAgICBhY2NvdW50UmVjb3Zlcnk6IGNvZ25pdG8uQWNjb3VudFJlY292ZXJ5LkVNQUlMX09OTFksXG4gICAgICAgICAgICBwYXNzd29yZFBvbGljeToge1xuICAgICAgICAgICAgICAgIG1pbkxlbmd0aDogNixcbiAgICAgICAgICAgICAgICByZXF1aXJlTG93ZXJjYXNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVVcHBlcmNhc2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVEaWdpdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVxdWlyZVN5bWJvbHM6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgICAgICAgc2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBzaWduSW5BbGlhc2VzOiB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG11dGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1c2VyUG9vbE5hbWU6IGAke0NPTlNUQU5UUy5QUk9KRUNUX05BTUV9YCxcbiAgICAgICAgICAgIC8vIHVzZXJQb29sTmFtZTogJzEyMzQ1JyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZm9yIGZpbmRpbmcgcGFzc3dvcmQsIHNpZ24taW4sIGV0Yy5cbiAgICAgICAgY29uc3QgdXNlclBvb2xDbGllbnQgPSBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCAnVXNlclBvb2xDbGllbnQnLCB7XG4gICAgICAgICAgICB1c2VyUG9vbDogdGhpcy51c2VyUG9vbCxcbiAgICAgICAgICAgIGF1dGhGbG93czoge1xuICAgICAgICAgICAgICAgIHVzZXJTcnA6IHRydWUsICAvLyBzZWN1cmUgcmVtb3RlIHBhc3N3b3JkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICBjb2duaXRvLlVzZXJQb29sQ2xpZW50SWRlbnRpdHlQcm92aWRlci5DT0dOSVRPLFxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVzZXJQb29sLmFkZERvbWFpbihgJHtDT05TVEFOVFMuUFJPSkVDVF9OQU1FfURvbWFpbmAsIHtcbiAgICAgICAgICAgIGNvZ25pdG9Eb21haW46IHtcbiAgICAgICAgICAgICAgICAvLyBkb21haW5QcmVmaXg6ICBgJHtDT05TVEFOVFMuUFJPSkVDVF9OQU1FfS1hcHBgLFxuICAgICAgICAgICAgICAgIGRvbWFpblByZWZpeDogIGAke0NPTlNUQU5UUy5QUk9KRUNUX05BTUUudG9Mb3dlckNhc2UoKX0tYXBwYCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZvciBncmFudCBhY2Nlc3NpbmcgYXdzIHJlc291cmNlc1xuICAgICAgICAvLyBjb25zdCBpZGVudGl0eVBvb2wgPSBuZXcgY29nbml0by5DZm5JZGVudGl0eVBvb2wodGhpcywgJ0lkZW50aXR5UG9vbCcsIHtcbiAgICAgICAgLy8gICAgIGFsbG93VW5hdXRoZW50aWNhdGVkSWRlbnRpdGllczogdHJ1ZSxcbiAgICAgICAgLy8gICAgIGNvZ25pdG9JZGVudGl0eVByb3ZpZGVyczogW1xuICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgY2xpZW50SWQ6IHVzZXJQb29sQ2xpZW50LnVzZXJQb29sQ2xpZW50SWQsXG4gICAgICAgIC8vICAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogdGhpcy51c2VyUG9vbC51c2VyUG9vbFByb3ZpZGVyTmFtZSxcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICBdXG4gICAgICAgIC8vIH0pO1xuICAgIH1cblxufSJdfQ==