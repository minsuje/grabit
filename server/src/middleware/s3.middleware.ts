import { Injectable, NestMiddleware, Request, Next } from '@nestjs/common';
import { Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and } from 'drizzle-orm';

@Injectable()
export class s3Middleware implements NestMiddleware {
  async use(req: Request, res: Response, next: (error?: any) => void) {
    const body: any = req.body;
    const { filename, type } = body;
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: filename,
      ContentType: type,
    });
    // return await getSignedUrl(client, command);
    const url = await getSignedUrl(client, command);
    console.log('url > ', url);
    //  https://awsbucket-grabit.s3.ap-northeast-2.amazonaws.com/abc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIASXWMWIHFRIO5NU3B%2F20240123%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20240123T011109Z&X-Amz-Expires=900&X-Amz-Signature=dd763b4858cb3c4b3c80d034b3378ad61b32764e02fb8f9c5e729b13cdf4919d&X-Amz-SignedHeaders=host&x-id=PutObject
    // 여기서 필요로 하는 값은 https://awsbucket-grabit.s3.ap-northeast-2.amazonaws.com/abc.png
    // 여기서 필요한 db에 저장하는 값은 abc.png

    // 컨트롤러로 req 값 전달하기
    req['file'] = url;

    next();
  }
}
