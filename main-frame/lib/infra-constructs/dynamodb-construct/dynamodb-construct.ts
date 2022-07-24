import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { CONSTANTS } from '../../../config/shared';

export class DynamoDBConstruct extends Construct {
    public noticeTable: dynamodb.Table;

    constructor(scope: Construct, id: string, props?: any) {
        super(scope, id);

        // create notice table
        this.noticeTable = new dynamodb.Table(this, id, {
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 5,
            writeCapacity: 5,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: 'title',
                type: dynamodb.AttributeType.STRING,
            },
            tableName: `${CONSTANTS.PROJECT_NAME.toLocaleLowerCase()}_notice`,
        });

        this.noticeTable.addLocalSecondaryIndex({
            indexName: 'titleIndex',
            sortKey: {
                name: 'title',
                type: dynamodb.AttributeType.STRING,
            },
            projectionType: dynamodb.ProjectionType.ALL,
        });

        // provisioned autoscaling
        const readSacling = this.noticeTable.autoScaleReadCapacity({
            minCapacity: 5,
            maxCapacity: 50
        });
        readSacling.scaleOnUtilization({targetUtilizationPercent: 50});

        const writeScaling = this.noticeTable.autoScaleWriteCapacity({
            minCapacity: 5,
            maxCapacity: 50,
        });
        writeScaling.scaleOnUtilization({targetUtilizationPercent: 50});

        // grant permissions on table
        // this.table.grantReadData(new iam.AccountRootPrincipal());
    }
}