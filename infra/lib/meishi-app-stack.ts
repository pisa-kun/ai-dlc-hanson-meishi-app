import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export interface MeishiAppStackProps extends cdk.StackProps {
  envName: 'prod' | 'dev';
}

/**
 * Self-introduction page hosting stack:
 *  - S3 (private, BLOCK_ALL)
 *  - CloudFront with Origin Access Control (OAC)
 *  - BucketDeployment to sync web/out/ and invalidate /*
 */
export class MeishiAppStack extends cdk.Stack {
  public readonly siteBucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: MeishiAppStackProps) {
    super(scope, id, props);

    // ── S3: private site bucket ──
    this.siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ── CloudFront Function: rewrite URIs to append index.html ──
    // e.g. /ja/ → /ja/index.html, / → /index.html
    const rewriteFunction = new cloudfront.Function(this, 'RewriteFunction', {
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
      `),
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      comment: 'Append index.html to directory-style URIs',
    });

    // ── CloudFront Distribution with S3 + OAC origin ──
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        functionAssociations: [{
          function: rewriteFunction,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      comment: `Self-introduction page (${props.envName})`,
    });

    // ── BucketDeployment: sync web/out/ + invalidate /* ──
    new s3deploy.BucketDeployment(this, 'DeployStaticSite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', '..', 'web', 'out'))],
      destinationBucket: this.siteBucket,
      distribution: this.distribution,
      distributionPaths: ['/*'],
      memoryLimit: 512,
      ephemeralStorageSize: cdk.Size.mebibytes(1024),
      cacheControl: [
        s3deploy.CacheControl.maxAge(cdk.Duration.days(1)),
        s3deploy.CacheControl.sMaxAge(cdk.Duration.days(30)),
      ],
    });

    // ── Outputs ──
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.domainName,
      description: 'CloudFront URL — open this in your browser',
    });
    new cdk.CfnOutput(this, 'SiteBucketName', {
      value: this.siteBucket.bucketName,
      description: 'S3 bucket holding the static site',
    });
    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront Distribution ID',
    });
  }
}
