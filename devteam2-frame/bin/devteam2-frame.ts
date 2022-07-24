#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Devteam2FrameStack } from '../stack/devteam2-frame-stack';

const app = new cdk.App();

new Devteam2FrameStack(app, 'Devteam2FrameStack', {
});

app.synth();