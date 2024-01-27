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
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { authentication, challenge } from '../modules/challenge/schema';
import { db } from '../../db/db';
import { v1 as uuid } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();
const moment = require('moment-timezone');

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
      // 오늘 이미 인증한 사진 있으면 더 이상 사진 올리지 못하도록 막기
      // let today = `${(new Date().getMonth() + 1).toString()}/${new Date().getDate()}/${new Date().getFullYear()}`;
      let today = new Date()
        .toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
        .split(',')[0];
      // console.log('today', today);
      let auths = await db
        .select({
          created_at: authentication.created_at,
          userid_num: authentication.userid_num,
        })
        .from(authentication)
        .where(
          and(eq(authentication.challenge_id, Number(req.url.split('/')[1]))),
        );

      let todayAuth = [];
      for (let i = 0; i < auths.length; i++) {
        let date = auths[i].created_at
          .toLocaleString('en-US', {
            timeZone: 'Asia/Seoul',
          })
          .split(',')[0];
        if (today === date) todayAuth.push(auths[i]);
      }
      // console.log('todayAuth', todayAuth);

      let already = false;
      for (let i = 0; i < todayAuth.length; i++) {
        if (todayAuth[i].userid_num === 3)
          // 3은 현재 로그인한 유저의 userid_num
          already = true;
      }

      if (!already) {
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
        } else req['file'] = null;
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
