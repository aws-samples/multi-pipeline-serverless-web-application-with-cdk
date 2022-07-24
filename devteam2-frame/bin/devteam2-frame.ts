#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Devteam2FrameStack } from '../stack/devteam2-frame-stack';
import { CdkPipelineStack } from '../stack/cdkPipeline-stack';

const app = new cdk.App();
new CdkPipelineStack(app, 'CdkPipelineStack');

new Devteam2FrameStack(app, 'Devteam2FrameStack', {
});

app.synth();