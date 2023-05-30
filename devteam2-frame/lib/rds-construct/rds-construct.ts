import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';
import { CONSTANTS } from '../../config/shared';
import * as secretManger from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';

export class RdsConstruct extends Construct {
    public dbInstance: rds.DatabaseInstance;
    public proxy: rds.DatabaseProxy;
    public vpc: ec2.Vpc;
    public iamRoleForLambda: iam.Role;
    public lambdaToProxySg: ec2.SecurityGroup;
    public dbCredentialSecret: secretManger.Secret;

    constructor(scope: Construct, id: string, props?: any) {
        super(scope, id);
        
        // create the VPC
        this.vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
            cidr: '10.0.0.0/16',
            natGateways: 0,
            vpcName: `${CONSTANTS.PROJECT_NAME}-VPC`,
            enableDnsHostnames: true,
            enableDnsSupport: true,
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'private subnet 1',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 24,
                },
                {
                    name: 'private subnet 2',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 24,
                },
            ],
        });

        // create Security Group
        this.lambdaToProxySg = new ec2.SecurityGroup(this, 'proxySG', {
            vpc: this.vpc,
            description: 'Proxy SG',
            // allowAllOutbound: true,
        });
        const dbConnectionSg = new ec2.SecurityGroup(this, 'dbSG', {
            vpc: this.vpc,
            description: 'RDS Proxy to DB SG',
            // allowAllOutbound: false,
        });

        dbConnectionSg.addIngressRule(dbConnectionSg, ec2.Port.tcp(3306),
            'allow db connection');
        dbConnectionSg.addIngressRule(this.lambdaToProxySg, ec2.Port.tcp(3306),
            'allow lambda connection');

        // secret manager
        this.dbCredentialSecret = new secretManger.Secret(this, 'dbSecret', {
            secretName: 'db-credentials',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                    username: 'mysqldb',
                }),
                excludePunctuation: true,
                includeSpace: false,
                generateStringKey: 'password',
            }
        });

        // Lambda Interface Endpoint
        new ec2.InterfaceVpcEndpoint(this, 'SecretManagerVpcEndpoint', {
            vpc: this.vpc,
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
        });

        // create DB Cluster
        this.dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
            vpc: this.vpc,
            vpcSubnets: {
              subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
            engine: rds.DatabaseInstanceEngine.mysql({
              version: rds.MysqlEngineVersion.VER_8_0_28,
            }),
            instanceType: ec2.InstanceType.of(
              ec2.InstanceClass.T3,
              ec2.InstanceSize.LARGE,
            ),
            credentials: rds.Credentials.fromSecret(this.dbCredentialSecret),
            multiAz: false,
            allocatedStorage: 100,
            maxAllocatedStorage: 120,
            allowMajorVersionUpgrade: true,
            autoMinorVersionUpgrade: true,
            backupRetention: cdk.Duration.days(0),
            deleteAutomatedBackups: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            deletionProtection: false,
            databaseName: 'cdkdemo',
            publiclyAccessible: false,
            parameterGroup: new rds.ParameterGroup(this, 'parameterGroup', {
                engine: rds.DatabaseInstanceEngine.mysql({
                    version: rds.MysqlEngineVersion.VER_8_0_28,
                }),
                parameters: {
                    character_set_client: 'utf8mb4',
                    character_set_server: 'utf8mb4',
                },
            }),
        });

        // rds proxy
        this.proxy = this.dbInstance.addProxy('rdsProxy', {
            secrets: [this.dbCredentialSecret],
            debugLogging: true,
            vpc: this.vpc,
            requireTLS: false,
            securityGroups: [dbConnectionSg],
        })

        // IAM Role for Lambda
        this.iamRoleForLambda = new iam.Role(this, 'iamRoleForLambda', {
            roleName: `${CONSTANTS.PROJECT_NAME.toLowerCase()}-lambda-role`,
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'service-role/AWSLambdaVPCAccessExecutionRole'
                ),
            ],
        });

        // output
        new cdk.CfnOutput(this, 'Proxy Endpoint', {
            exportName: 'ProxyEndpoint',
            value: this.proxy.endpoint,
        })
    }
}