"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3WebhostConstruct = void 0;
const constructs_1 = require("constructs");
const s3 = require("aws-cdk-lib/aws-s3");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const cdk = require("aws-cdk-lib");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
// import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
const aws_cloudfront_1 = require("aws-cdk-lib/aws-cloudfront");
class S3WebhostConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // Create S3 Bucket
        this.cDKDemoBucket = new s3.Bucket(this, 'WebsiteBucket', {
            bucketName: props.buckName,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            autoDeleteObjects: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        // CloudFront OAI
        const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'cfOriginAccessIdentity', {
            comment: 'S3 Webhosting CloudFront OAI',
        });
        // grant to S3 Bucket Read policy with OAI
        this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
            originConfigs: [{
                    behaviors: [{
                            isDefaultBehavior: true,
                            compress: true,
                            viewerProtocolPolicy: aws_cloudfront_1.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                        }],
                    s3OriginSource: {
                        s3BucketSource: this.cDKDemoBucket,
                        originAccessIdentity: originAccessIdentity,
                    },
                }],
            errorConfigurations: [
                {
                    errorCode: 403,
                    responseCode: 200,
                    responsePagePath: '/index.html',
                    errorCachingMinTtl: 10,
                },
                {
                    errorCode: 404,
                    responseCode: 200,
                    responsePagePath: '/index.html',
                    errorCachingMinTtl: 10,
                }
            ]
        });
        // Deploy hosting files
        new s3deploy.BucketDeployment(this, 'DeployWebsite', {
            sources: [s3deploy.Source.asset('./website-dist')],
            destinationBucket: this.cDKDemoBucket,
            distribution: this.distribution,
            distributionPaths: ["/*"],
        });
        this.cDKDemoBucket.addCorsRule({
            allowedMethods: [
                s3.HttpMethods.GET,
                s3.HttpMethods.DELETE,
                s3.HttpMethods.PUT,
                s3.HttpMethods.POST
            ],
            allowedOrigins: ['*'],
            allowedHeaders: ['*'],
        });
        // Output
        new cdk.CfnOutput(this, 'S3WebhostBucketName', {
            value: props.buckName,
            exportName: 'S3WebhostBucketName',
        });
        new cdk.CfnOutput(this, "DistributionDomainName", {
            value: this.distribution.distributionDomainName,
            exportName: 'CFDomainName',
        });
    }
}
exports.S3WebhostConstruct = S3WebhostConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtd2ViaG9zdC1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzMy13ZWJob3N0LWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBdUM7QUFDdkMseUNBQXlDO0FBQ3pDLDBEQUEwRDtBQUMxRCxtQ0FBbUM7QUFDbkMseURBQXlEO0FBQ3pELGlFQUFpRTtBQUNqRSwrREFBaUg7QUFNakgsTUFBYSxrQkFBbUIsU0FBUSxzQkFBUztJQUs3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQThCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsbUJBQW1CO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDdEQsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQzFCLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxlQUFlLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0I7WUFDMUQsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVM7WUFDakQsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQzNDLENBQUMsQ0FBQztRQUVILGlCQUFpQjtRQUNqQixNQUFNLG9CQUFvQixHQUFHLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUM3RixPQUFPLEVBQUUsOEJBQThCO1NBQzFDLENBQUMsQ0FBQTtRQUVGLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDL0UsYUFBYSxFQUFFLENBQUM7b0JBQ1osU0FBUyxFQUFFLENBQUM7NEJBQ1IsaUJBQWlCLEVBQUUsSUFBSTs0QkFDdkIsUUFBUSxFQUFFLElBQUk7NEJBQ2Qsb0JBQW9CLEVBQUUscUNBQW9CLENBQUMsaUJBQWlCO3lCQUMvRCxDQUFDO29CQUNGLGNBQWMsRUFBRTt3QkFDWixjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWE7d0JBQ2xDLG9CQUFvQixFQUFFLG9CQUFvQjtxQkFDN0M7aUJBQ0osQ0FBQztZQUNGLG1CQUFtQixFQUFFO2dCQUNqQjtvQkFDSSxTQUFTLEVBQUUsR0FBRztvQkFDZCxZQUFZLEVBQUUsR0FBRztvQkFDakIsZ0JBQWdCLEVBQUUsYUFBYTtvQkFDL0Isa0JBQWtCLEVBQUUsRUFBRTtpQkFDekI7Z0JBQ0Q7b0JBQ0ksU0FBUyxFQUFFLEdBQUc7b0JBQ2QsWUFBWSxFQUFFLEdBQUc7b0JBQ2pCLGdCQUFnQixFQUFFLGFBQWE7b0JBQy9CLGtCQUFrQixFQUFFLEVBQUU7aUJBQ3pCO2FBQ0o7U0FDSixDQUFDLENBQUE7UUFFRix1QkFBdUI7UUFDdkIsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNqRCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2xELGlCQUFpQixFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ3JDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUMvQixpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQztTQUM1QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQztZQUMzQixjQUFjLEVBQUU7Z0JBQ1osRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHO2dCQUNsQixFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU07Z0JBQ3JCLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRztnQkFDbEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJO2FBQ3RCO1lBQ0QsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ3JCLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUN4QixDQUFDLENBQUM7UUFFSCxTQUFTO1FBQ1QsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUMzQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDckIsVUFBVSxFQUFFLHFCQUFxQjtTQUNwQyxDQUFDLENBQUE7UUFDRixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQzlDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLHNCQUFzQjtZQUMvQyxVQUFVLEVBQUUsY0FBYztTQUM3QixDQUFDLENBQUE7SUFDTixDQUFDO0NBQ0o7QUFsRkQsZ0RBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtZGVwbG95bWVudCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udCc7XG4vLyBpbXBvcnQgKiBhcyBvcmlnaW5zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250LW9yaWdpbnMnO1xuaW1wb3J0IHsgQ2ZuQ2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5LCBQcmljZUNsYXNzLCBWaWV3ZXJQcm90b2NvbFBvbGljeSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFMzV2ViaG9zdENvbnN0cnVjdFByb3BzIHtcbiAgICBidWNrTmFtZTogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBTM1dlYmhvc3RDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gICAgcHVibGljIGRpc3RyaWJ1dGlvbjogY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uO1xuICAgIHB1YmxpYyBjREtEZW1vQnVja2V0OiBzMy5CdWNrZXQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUzNXZWJob3N0Q29uc3RydWN0UHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICAvLyBDcmVhdGUgUzMgQnVja2V0XG4gICAgICAgIHRoaXMuY0RLRGVtb0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1dlYnNpdGVCdWNrZXQnLCB7XG4gICAgICAgICAgICBidWNrZXROYW1lOiBwcm9wcy5idWNrTmFtZSxcbiAgICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgb2JqZWN0T3duZXJzaGlwOiBzMy5PYmplY3RPd25lcnNoaXAuQlVDS0VUX09XTkVSX1BSRUZFUlJFRCxcbiAgICAgICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENsb3VkRnJvbnQgT0FJXG4gICAgICAgIGNvbnN0IG9yaWdpbkFjY2Vzc0lkZW50aXR5ID0gbmV3IGNsb3VkZnJvbnQuT3JpZ2luQWNjZXNzSWRlbnRpdHkodGhpcywgJ2NmT3JpZ2luQWNjZXNzSWRlbnRpdHknLCB7XG4gICAgICAgICAgICBjb21tZW50OiAnUzMgV2ViaG9zdGluZyBDbG91ZEZyb250IE9BSScsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gZ3JhbnQgdG8gUzMgQnVja2V0IFJlYWQgcG9saWN5IHdpdGggT0FJXG4gICAgICAgIHRoaXMuZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCAnRGlzdHJpYnV0aW9uJywge1xuICAgICAgICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgICAgICAgICBiZWhhdmlvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb21wcmVzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld2VyUHJvdG9jb2xQb2xpY3k6IFZpZXdlclByb3RvY29sUG9saWN5LlJFRElSRUNUX1RPX0hUVFBTLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgIHMzQnVja2V0U291cmNlOiB0aGlzLmNES0RlbW9CdWNrZXQsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbkFjY2Vzc0lkZW50aXR5OiBvcmlnaW5BY2Nlc3NJZGVudGl0eSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBlcnJvckNvbmZpZ3VyYXRpb25zOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU6IDQwMyxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VDb2RlOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlUGFnZVBhdGg6ICcvaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2FjaGluZ01pblR0bDogMTAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUNvZGU6IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VQYWdlUGF0aDogJy9pbmRleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JDYWNoaW5nTWluVHRsOiAxMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gRGVwbG95IGhvc3RpbmcgZmlsZXNcbiAgICAgICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveVdlYnNpdGUnLCB7XG4gICAgICAgICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KCcuL3dlYnNpdGUtZGlzdCcpXSxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiB0aGlzLmNES0RlbW9CdWNrZXQsXG4gICAgICAgICAgICBkaXN0cmlidXRpb246IHRoaXMuZGlzdHJpYnV0aW9uLFxuICAgICAgICAgICAgZGlzdHJpYnV0aW9uUGF0aHM6IFtcIi8qXCJdLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNES0RlbW9CdWNrZXQuYWRkQ29yc1J1bGUoe1xuICAgICAgICAgICAgYWxsb3dlZE1ldGhvZHM6IFtcbiAgICAgICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5HRVQsXG4gICAgICAgICAgICAgICAgczMuSHR0cE1ldGhvZHMuREVMRVRFLFxuICAgICAgICAgICAgICAgIHMzLkh0dHBNZXRob2RzLlBVVCxcbiAgICAgICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5QT1NUXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYWxsb3dlZE9yaWdpbnM6IFsnKiddLFxuICAgICAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnKiddLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBPdXRwdXRcbiAgICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1MzV2ViaG9zdEJ1Y2tldE5hbWUnLCB7XG4gICAgICAgICAgICB2YWx1ZTogcHJvcHMuYnVja05hbWUsXG4gICAgICAgICAgICBleHBvcnROYW1lOiAnUzNXZWJob3N0QnVja2V0TmFtZScsXG4gICAgICAgIH0pXG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiRGlzdHJpYnV0aW9uRG9tYWluTmFtZVwiLCB7XG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5kaXN0cmlidXRpb24uZGlzdHJpYnV0aW9uRG9tYWluTmFtZSxcbiAgICAgICAgICAgIGV4cG9ydE5hbWU6ICdDRkRvbWFpbk5hbWUnLFxuICAgICAgICB9KVxuICAgIH1cbn0iXX0=