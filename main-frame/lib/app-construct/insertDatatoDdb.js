"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertDataToDdbConstruct = void 0;
const cdk = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const cr = require("aws-cdk-lib/custom-resources");
const iam = require("aws-cdk-lib/aws-iam");
// insert 3 datas to dynamoDB after Table created
class InsertDataToDdbConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
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
        });
    }
}
exports.InsertDataToDdbConstruct = InsertDataToDdbConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0RGF0YXRvRGRiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5zZXJ0RGF0YXRvRGRiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQywyQ0FBdUM7QUFDdkMsNkJBQTZCO0FBQzdCLGlEQUFpRDtBQUNqRCxtREFBbUQ7QUFDbkQsMkNBQTJDO0FBTzNDLGlEQUFpRDtBQUNqRCxNQUFhLHdCQUF5QixTQUFRLHNCQUFTO0lBQ25ELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixnQkFBZ0I7UUFDaEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDN0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLCtCQUErQixDQUFDLENBQUM7WUFDbEYsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDakMsWUFBWSxFQUFFLGVBQWU7WUFDN0IscUJBQXFCLEVBQUU7Z0JBQ25CLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87Z0JBQ3hDLGFBQWEsRUFBRSxDQUFDO2FBQ25CO1NBQ0osQ0FBQyxDQUFDO1FBRUgsbUJBQW1CO1FBQ25CLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRWhELHVCQUF1QjtRQUN2QixNQUFNLGFBQWEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDckUsTUFBTSxFQUFFLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7b0JBQ3ZFLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDO29CQUNsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO29CQUN4QixTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO2lCQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNKLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEMsUUFBUSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsVUFBVSxFQUFFO29CQUNSLFlBQVksRUFBRSxhQUFhLENBQUMsWUFBWTtvQkFDeEMsY0FBYyxFQUFFLE9BQU87aUJBQzFCO2dCQUNELGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUM7YUFDN0U7U0FVSixDQUFDLENBQUE7SUFDTixDQUFDO0NBQ0o7QUFqREQsNERBaURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJ2F3cy1jZGstbGliL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcblxuZXhwb3J0IGludGVyZmFjZSBpbnNlcnREYXRhUHJvcHMge1xuICAgIG5vdGljZVRhYmxlOiBkeW5hbW9kYi5UYWJsZSxcbn1cblxuLy8gaW5zZXJ0IDMgZGF0YXMgdG8gZHluYW1vREIgYWZ0ZXIgVGFibGUgY3JlYXRlZFxuZXhwb3J0IGNsYXNzIEluc2VydERhdGFUb0RkYkNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGluc2VydERhdGFQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBsYW1iZGFcbiAgICAgICAgY29uc3QgZGRiSW5pdExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ2RkYkluaXRMYW1iZGEnLCB7XG4gICAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJy8uLi8uLi9sYW1iZGEvbm90aWNlcy9zZXREYXRhJykpLFxuICAgICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE2X1gsXG4gICAgICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgICAgICBtZW1vcnlTaXplOiAyNTYsXG4gICAgICAgICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6ICdkZGJJbml0TGFtYmRhJyxcbiAgICAgICAgICAgIGN1cnJlbnRWZXJzaW9uT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICAgICAgICAgICAgcmV0cnlBdHRlbXB0czogMixcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZ3JhbnQgcGVybWlzc2lvblxuICAgICAgICBwcm9wcy5ub3RpY2VUYWJsZS5ncmFudFdyaXRlRGF0YShkZGJJbml0TGFtYmRhKTtcblxuICAgICAgICAvLyBydW4gbGFtYmRhIG9uIGNyZWF0ZVxuICAgICAgICBjb25zdCBsYW1iZGFUcmlnZ2VyID0gbmV3IGNyLkF3c0N1c3RvbVJlc291cmNlKHRoaXMsICdkZGJMYW1iZGFUcmlnZ2VyJywge1xuICAgICAgICAgICAgcG9saWN5OiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU3RhdGVtZW50cyhbbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnbGFtYmRhOkludm9rZUZ1bmN0aW9uJ10sXG4gICAgICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczogW2RkYkluaXRMYW1iZGEuZnVuY3Rpb25Bcm5dLFxuICAgICAgICAgICAgfSldKSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlOiAnTGFtYmRhJyxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdpbnZva2UnLFxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgRnVuY3Rpb25OYW1lOiBkZGJJbml0TGFtYmRhLmZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgSW52b2NhdGlvblR5cGU6ICdFdmVudCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5vZignSm9iU2VuZGVyVHJpZ2dlclBoeXNpY2FsSWQnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBvblVwZGF0ZToge1xuICAgICAgICAgICAgLy8gICAgIHNlcnZpY2U6ICdMYW1iZGEnLFxuICAgICAgICAgICAgLy8gICAgIGFjdGlvbjogJ2ludm9rZScsXG4gICAgICAgICAgICAvLyAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgLy8gICAgICAgICBGdW5jdGlvbk5hbWU6IGRkYkluaXRMYW1iZGEuZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgLy8gICAgICAgICBJbnZvY2F0aW9uVHlwZTogJ0V2ZW50JyxcbiAgICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgICAgLy8gICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdKb2JTZW5kZXJUcmlnZ2VyUGh5c2ljYWxJZCcpLFxuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgfSlcbiAgICB9XG59Il19