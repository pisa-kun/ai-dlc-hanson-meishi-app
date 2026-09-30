import { describe, it, expect } from 'vitest';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MeishiAppStack } from '../lib/meishi-app-stack';

describe('MeishiAppStack', () => {
  it('creates a private S3 bucket and CloudFront Distribution', () => {
    const app = new cdk.App();
    const stack = new MeishiAppStack(app, 'TestStack', { envName: 'prod' });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::S3::Bucket', 1);
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);

    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
  });
});
