#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MeishiAppStack } from '../lib/meishi-app-stack';

const app = new cdk.App();

const stack = new MeishiAppStack(app, 'MeishiAppProdStack', {
  envName: 'prod',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1',
  },
  description: 'Self-introduction page (prod): S3 + CloudFront + OAC',
});

cdk.Tags.of(stack).add('Project', 'MeishiApp');
cdk.Tags.of(stack).add('Env', 'prod');
cdk.Tags.of(stack).add('ManagedBy', 'CDK');
