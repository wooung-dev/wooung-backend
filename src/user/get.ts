import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { USER_JWT_CONTENTS } from '@lib/jwt';
import mysqlUtil from '@lib/mysqlUtil';

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  const userIdx = event.requestContext.authorizer.lambda.idx;

  const userColumns = [...USER_JWT_CONTENTS, 'marketing_agreed'];
  const user = await mysqlUtil.getOne('tb_user', userColumns, { idx: userIdx });

  return {
    statusCode: 200,
    body: JSON.stringify({ user }),
  };
};
