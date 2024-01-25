import { Injectable, NestMiddleware, Request, Next } from '@nestjs/common';
import { Response } from 'express';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and, desc, eq } from 'drizzle-orm';
import { users } from '../modules/user/schema';
import { db } from '../../db/db';
import { v1 as uuid } from 'uuid';

@Injectable()
export class profileImgMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: (error?: any) => void) {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
    let key;

    if (req.method === 'GET') {
      console.log('profileImg middleware url > ', Number(req.url.split('/')[1]));
      let file = await db
        .select()
        .from(users)
        .where(eq(users.userid_num, Number(req.url.split('/')[1])));

      if (file[0].login_type === 'normal') key = file[0].profile_img;
      else if (file[0].login_type === 'kakao') key = file[0].profile_img;
      // kakao 로그인일 때 이미지 파일명 이렇게 그대로 사용해도 되는지?
      // http://k.kakaocdn.net/dn/bhAmrx/btsca01IIpQ/mAfvKKmyoqpLgrdr1P7W81/img_640x640.jpg

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      });

      const url = await getSignedUrl(client, command, { expiresIn: 3600 });

      req['file'] = url;
    }
    next();
  }
}
