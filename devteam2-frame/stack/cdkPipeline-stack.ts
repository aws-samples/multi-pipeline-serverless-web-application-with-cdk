import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
// import * as pipeline from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { CONSTANTS } from '../config/shared';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { CodeBuildStep, CodePipelineSource, CodePipeline } from 'aws-cdk-lib/pipelines';

export class CdkPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // with CodeCommit
        const repo = new codecommit.Repository(this, 'cdkPipelineRepo', {
            repositoryName: 'cdkPipelineRepo'
        });

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'cdkDemoPipeline',
            synth: new CodeBuildStep('SynthStep', {
                input: CodePipelineSource.codeCommit(repo, 'main'),
                installCommands: [
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth',
                ]
            })
        })

        // const pipeline = new CodePipeline(this, 'Pipeline', {
        //     pipelineName: `${CONSTANTS.PROJECT_NAME.toLowerCase()}-pipeline`,
        //     synth: new CodeBuildStep('SynthStep', {
        //         input: CodePipelineSource.gitHub('JinHyun-Park/devteam2-frame', 'main'),
        //         installCommands: [
        //             'npm install -g aws-cdk'
        //         ],
        //         commands: [
        //             'npm ci',
        //             'npm run build',
        //             'npx cdk synth',
        //         ]
        //     })
        // })
    }
}