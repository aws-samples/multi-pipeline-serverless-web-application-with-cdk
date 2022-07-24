#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MainFrameStack } from '../stack/main-frame-stack';
import { DevTeam1Stack } from '../stack/dveteam1-stack';

const envObj = {
  region: 'ap-northeast-2'
}

const app = new cdk.App();

const mainFrameStack = new MainFrameStack(app, 'MainFrameStack', {
  env: envObj,
});

new DevTeam1Stack(app, 'DevTeam1Stack', mainFrameStack.apiGwConstruct, {
  env: envObj,
});

app.synth();