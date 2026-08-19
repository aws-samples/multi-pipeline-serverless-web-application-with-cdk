#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MainFrameStack } from '../stack/main-frame-stack';
import { DevTeam1Stack } from '../stack/dveteam1-stack';
import { CONSTANTS } from '../config/shared';

const envObj = {
  region: CONSTANTS.REGION
}

const app = new cdk.App();

const mainFrameStack = new MainFrameStack(app, 'MainFrameStack', {
  env: envObj,
});

new DevTeam1Stack(app, 'DevTeam1Stack', mainFrameStack.apiGwConstruct, {
  env: envObj,
});

app.synth();