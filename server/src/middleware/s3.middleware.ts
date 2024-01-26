import { Injectable, NestMiddleware, Request, Next } from '@nestjs/common';
import { Response } from 'express';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and, desc, eq } from 'drizzle-orm';
import { authentication } from '../modules/challenge/schema';
import { db } from '../../db/db';
import { v1 as uuid } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class s3Middleware implements NestMiddleware {
  async use(req: Request, res: Response, next: (error?: any) => void) {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });

    const body: any = req.body;

    let { filename, type } = body;
    let key;

    // console.log('middleware body', body);
    // console.log(req.method);
    // if (req.url.split('/')[2] === undefined) {
    //   console.log('req.url', req.url.split('/')[2]);
    // }
    if (req.method === 'GET') {
      // 인증 사진
      if (req.url.split('/')[2] === undefined) {
        // console.log('s3 middleware get!!', Number(req.url.split('/')[1]));
        let files = await db
          .select({
            userid_num: authentication.userid_num,
            authentication_img: authentication.authentication_img,
          })
          .from(authentication)
          .where(eq(authentication.challenge_id, Number(req.url.split('/')[1])))
          .orderBy(desc(authentication.created_at));
        // .limit(4);

        // console.log('s3 middleware detail files > ', files);
        let urls = [];
        for (let i = 0; i < files.length; i++) {
          key = files[i].authentication_img;
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
          });

          let url = await getSignedUrl(client, command, { expiresIn: 3600 });
          urls.push({ userid_num: files[i].userid_num, url: url });
        }
        req['file'] = urls;
      } else {
        let file = await db
          .select()
          .from(authentication)
          .where(
            eq(authentication.authentication_id, Number(req.url.split('/')[2])),
          );

        key = file[0].authentication_img;
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 3600 });

        req['file'] = url;
      }
    } else if (req.method === 'POST') {
      if (filename) {
        filename = uuid() + '.' + filename.split('.')[1];
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: filename,
          ContentType: type,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        //  https://awsbucket-grabit.s3.ap-northeast-2.amazonaws.com/abc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIASXWMWIHFRIO5NU3B%2F20240123%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20240123T011109Z&X-Amz-Expires=900&X-Amz-Signature=dd763b4858cb3c4b3c80d034b3378ad61b32764e02fb8f9c5e729b13cdf4919d&X-Amz-SignedHeaders=host&x-id=PutObject
        // 여기서 필요로 하는 값은 https://awsbucket-grabit.s3.ap-northeast-2.amazonaws.com/abc.png
        // 여기서 필요한 db에 저장하는 값은 abc.png

        // 컨트롤러로 req 값 전달하기
        req['file'] = url;
      }
    } else {
      let file = await db
        .select()
        .from(authentication)
        .where(
          eq(authentication.authentication_id, Number(req.url.split('/')[2])),
        );

      key = file[0].authentication_img;

      if (req.method === 'DELETE' || req.method === 'PATCH') {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
        };
        let command = new DeleteObjectCommand(params);
        await client.send(command);
      }
      if (req.method === 'PATCH') {
        filename = uuid() + '.' + filename.split('.')[1];
        let command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: filename,
          ContentType: type,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 3600 });

        req['file'] = url;
      }
    }
    next();
  }
}
