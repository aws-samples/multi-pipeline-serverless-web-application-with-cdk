import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { NoticeLambdaConstruct } from "../lib/app-construct/notice-lambda";
import { DynamoDBConstruct } from "../lib/infra-constructs/dynamodb-construct/dynamodb-construct";
import { ApiGWConstruct } from '../lib/infra-constructs/apigateway-construct/apigateway-construct';
import { InsertDataToDdbConstruct } from "../lib/app-construct/insertDatatoDdb";

export class DevTeam1Stack extends Stack {
    constructor(scope: Construct, id: string, apiGwConstruct: ApiGWConstruct, props?: StackProps) {
        super(scope, id, props);
        const dynamoDb = new DynamoDBConstruct(this, 'DynamoDB', {});

        const insertDataToDdbConstruct = new InsertDataToDdbConstruct(this, 'ddbInitLambdaStart', {
            noticeTable: dynamoDb.noticeTable,
        });

        const noticeLambda = new NoticeLambdaConstruct(this, 'NoticePostLambda', {
            noticeTable: dynamoDb.noticeTable,
            apiGwConstruct: apiGwConstruct,
        });
    }
}