#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Devteam2FrameStack } from '../stack/devteam2-frame-stack';
import { CONSTANTS } from '../config/shared';

const app = new cdk.App();

new Devteam2FrameStack(app, 'Devteam2FrameStack', {
  // Must match main-frame: this stack reads main-frame's exports via Fn.importValue.
  env: { region: CONSTANTS.REGION },
});

app.synth();