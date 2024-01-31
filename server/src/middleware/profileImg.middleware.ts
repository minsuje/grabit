import { Injectable, NestMiddleware, Next } from '@nestjs/common';
import { Response, Request } from 'express';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  CompressionType,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and, desc, eq } from 'drizzle-orm';
import { users } from '../modules/user/schema';
import { friend } from '../modules/friend/schema';
import { db } from '../../db/db';
import { v1 as uuid } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

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

    console.log('profileImg middleware originalUrl > ', req.originalUrl);

    // '/friend/detail' 경로로 요청 온 경우
    if (
      'friend/detail' ===
      `${req.originalUrl.split('/')[1]}/${req.originalUrl.split('/')[2]}`
    ) {
      let friend = await db
        .select({
          userid_num: users.userid_num,
          nickname: users.nickname,
          score_num: users.score_num,
          profile_img: users.profile_img,
        })
        .from(users)
        .where(eq(users.userid_num, Number(req.originalUrl.split('/')[3])));

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: friend[0].profile_img,
      });
      const url = await getSignedUrl(client, command, { expiresIn: 3600 });
      friend[0].profile_img = url;

      req['file'] = friend[0];
    }
    // '/friend' 경로로 요청 온 경우
    else if (req.baseUrl.split('/')[1] === 'friend') {
      let friends = [];
      // 양방향으로 친구 관계 확인
      const friends1 = await db
        .select({ friends_num: friend.other_userid_num })
        .from(friend)
        .where(eq(friend.userid_num, Number(req.url.split('/')[1])));
      const friends2 = await db
        .select({ friends_num: friend.userid_num })
        .from(friend)
        .where(eq(friend.other_userid_num, Number(req.url.split('/')[1])));
      for (let i = 0; i < friends1.length; i++) {
        friends.push(friends1[i].friends_num);
      }
      for (let i = 0; i < friends2.length; i++) {
        friends.push(friends2[i].friends_num);
      }
      let friend_info = [];
      for (let i = 0; i < friends.length; i++) {
        let friend = await db
          .select({
            userid_num: users.userid_num,
            nickname: users.nickname,
            profile_img: users.profile_img,
            score_num: users.score_num,
          })
          .from(users)
          .where(eq(users.userid_num, friends[i]));
        friend_info.push(friend[0]);
      }

      let friends_info = [];
      for (let i = 0; i < friends.length; i++) {
        if (friend_info[i].profile_img) {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: friend_info[i].profile_img,
          });
          const url = await getSignedUrl(client, command, { expiresIn: 3600 });
          friends_info.push({
            userid_num: friend_info[i].userid_num,
            nickname: friend_info[i].nickname,
            profile_img: url,
            score_num: friend_info[i].score_num,
          });
        } else {
          friends_info.push({
            userid_num: friend_info[i].userid_num,
            nickname: friend_info[i].nickname,
            profile_img: null,
            score_num: friend_info[i].score_num,
          });
        }
      }
      // console.log('friends_info > ', friends_info);
      req['file'] = friends_info;
    }
    // '/myPage', '/profileUpload' 경로로 요청 온 경우
    else {
      if (
        req.url.split('/')[1] === 'normal' ||
        req.originalUrl.split('/')[1] === 'myPage' // myPage 조회
      ) {
        const body: any = req.body;
        // console.log('profileImg middleware body > ', req.body);
        let { filename, type } = body;

        let key;

        if (req.method === 'GET') {
          let file = await db
            .select()
            .from(users)
            .where(eq(users.userid_num, Number(req.url.split('/')[1])));
          key = file[0].profile_img;
          // console.log('middleware profileImg key > ', key);
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
          });
          const url = await getSignedUrl(client, command, { expiresIn: 3600 });
          // console.log('middleware profileImg url > ', url);
          req['file'] = url;
        } else if (req.method === 'POST') {
          if (filename) {
            key = uuid() + '.' + filename.split('.')[1];
            const command = new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: key,
              ContentType: type,
            });
            const url = await getSignedUrl(client, command, {
              expiresIn: 3600,
            });
            req['file'] = url;
          }
        } else {
          let file = await db
            .select()
            .from(users)
            .where(eq(users.userid_num, Number(req.url.split('/')[1])));

          key = file[0].profile_img;
          if (req.method === 'DELETE' || req.method === 'PATCH') {
            const params = {
              Bucket: process.env.AWS_S3_BUCKET,
              Key: key,
            };
            let command = new DeleteObjectCommand(params);
            await client.send(command);
            if (req.method === 'PATCH') {
              console.log('PATCH>>>>>>>>');
              console.log('filename', filename);
              filename = uuid() + '.' + filename.split('.')[1];
              let command = new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: filename,
                ContentType: type,
              });

              const url = await getSignedUrl(client, command, {
                expiresIn: 3600,
              });

              console.log(url)
              req['file'] = url;
            }
          }
        }
      }
    }
    next();
  }
}
