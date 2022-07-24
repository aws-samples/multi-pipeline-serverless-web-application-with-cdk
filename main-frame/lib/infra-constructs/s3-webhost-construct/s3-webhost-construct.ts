import { Construct } from "constructs";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { CfnCloudFrontOriginAccessIdentity, PriceClass, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";

export interface S3WebhostConstructProps {
    buckName: string
}

export class S3WebhostConstruct extends Construct {

    public distribution: cloudfront.CloudFrontWebDistribution;
    public cDKDemoBucket: s3.Bucket;

    constructor(scope: Construct, id: string, props: S3WebhostConstructProps) {
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
        })

        // grant to S3 Bucket Read policy with OAI
        this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
            originConfigs: [{
                behaviors: [{
                    isDefaultBehavior: true,
                    compress: true,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
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
        })

        // Deploy hosting files
        new s3deploy.BucketDeployment(this, 'DeployWebsite', {
            sources: [s3deploy.Source.asset('./website-dist')],
            destinationBucket: this.cDKDemoBucket,
            distribution: this.distribution,
            distributionPaths: ["/*"],
            prune: false,
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
        new cdk.CfnOutput(this, 'S3BucketArn', {
            value: this.cDKDemoBucket.bucketArn,
            exportName: 'S3BucketArn',
        });
        new cdk.CfnOutput(this, "DistributionDomainName", {
            value: this.distribution.distributionDomainName,
            exportName: 'CFDomainName',
        });
    }
}