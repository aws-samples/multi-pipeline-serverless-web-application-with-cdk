import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BoardLambdaConstruct } from '../lib/app-construct/board-lambda';
import { CreateTableLmabdaConstruct } from '../lib/app-construct/createTable-lambda';
import { DeployApiGwConstruct } from '../lib/rds-construct/deployApiGw-construct';
import { RdsConstruct } from '../lib/rds-construct/rds-construct';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Devteam2FrameStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // make rds and proxy
    const rdsConstruct = new RdsConstruct(this, 'RdsNetwork', {});
    
    // create table and insert data. it runs once.
    const createTable = new CreateTableLmabdaConstruct(this, 'createRdsTable', {
      rdsConstruct: rdsConstruct,
    })

    // create lambda for board service
    const boardLambda = new BoardLambdaConstruct(this, 'BoardLambda', {
      rdsConstruct: rdsConstruct,
    });

    const deployApiGw = new DeployApiGwConstruct(this, 'DeployApiGw', {
      boardLambda: boardLambda,
    });
  }
}
