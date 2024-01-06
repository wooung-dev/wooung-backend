import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { USER_JWT_CONTENTS } from '@lib/jwt';
import mysqlUtil from '@lib/mysqlUtil';
import { getHeadObject, getPresignedUrl } from '@lib/aws/s3Util';

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  const userIdx = event.requestContext.authorizer.lambda.idx;
  const userEmail = event.requestContext.authorizer.lambda.user_email;

  // 유저 정보 조회
  const userColumns = [...USER_JWT_CONTENTS, 'marketing_agreed'];
  const user = await mysqlUtil.getOne('tb_user', userColumns, { idx: userIdx });

  // 프로필 이미지 presigned url 발급
  const s3ObjectKey = `profile/${userEmail}/image`;
  const presignedUrl = await getPresignedUrl(s3ObjectKey);
  const { ContentType: contentType } = await getHeadObject(s3ObjectKey);

  return {
    statusCode: 200,
    body: JSON.stringify({ user, profileImage: { presignedUrl, contentType } }),
  };
};
