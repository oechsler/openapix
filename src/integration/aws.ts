import { Construct } from 'constructs';
import { IntegrationProps, IntegrationType, AwsIntegrationProps as CdkAwsIntegrationProps } from 'aws-cdk-lib/aws-apigateway';
import { BaseIntegration, IntegrationConfig, ValidatorConfig } from './base';
import { Stack } from 'aws-cdk-lib';

export interface AwsIntegrationProps extends CdkAwsIntegrationProps, ValidatorConfig {}

/** Defines direct AWS service integration. */
export class AwsIntegration extends BaseIntegration {

  /**
   * Defines direct AWS service integration.
   *
   * @example
   * '/item': {
   *   'GET': new openapix.AwsIntegration(this, {
   *     service: 'dynamodb',
   *     action: 'GetItem',
   *     options: {
   *       credentialsRole: role,
   *       requestTemplates: {
   *         'application/json': JSON.stringify({
   *           "TableName": table.tableName,
   *           "Key": {
   *             'PK': {
   *               "S": "$input.params('item')"
   *             }
   *           }
   *         }),
   *       },
   *     },
   *   }),
   * },
   */
  constructor(scope: Construct, props: AwsIntegrationProps) {

    const integration: IntegrationProps = {
      type: IntegrationType.AWS,
      uri: AwsIntegration.resolveUri(scope, props),
      integrationHttpMethod: props.integrationHttpMethod || 'POST',
      options: props.options,
    };

    const config: IntegrationConfig = {
      validator: props.validator,
    };

    super(integration, config);
  }

  /** Resolves the AWS service integration URI. */
  private static resolveUri(scope: Construct, props: AwsIntegrationProps): string {
    const region = props.region || Stack.of(scope).region;
    return `arn:aws:apigateway:${region}:${props.service}:action/${props.action}`;
  }
}
