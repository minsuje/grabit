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
import { JwtService } from '@nestjs/jwt';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and, desc, eq } from 'drizzle-orm';
import { users } from '../modules/user/schema';
import { friend } from '../modules/friend/schema';
import { db } from '../../db/db';
import { v1 as uuid } from 'uuid';
import * as dotenv from 'dotenv';
import { fromUnixTime } from 'date-fns';
dotenv.config();

@Injectable()
export class profileImgMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: Request, res: Response, next: (error?: any) => void) {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });

    console.log(
      'profileImg middleware originalUrl > ',
      req.originalUrl.split('/')[1],
    );

    let userInfo: string, decodedUserInfo: any, userid_num: number;

    // 로그인한 유저의 userid_num 찾아오기
    if (req.headers['authorization']) {
      userInfo = req.headers['authorization'].split(' ')[1];
      decodedUserInfo = await this.jwtService.verify(userInfo, {
        secret: process.env.JWT_SECRET_KEY,
      });
      userid_num = decodedUserInfo.userid_num;
    }
    console.log('userid_num > ', userid_num);

    // '/friend/detail', '/profile/:userid' 경로로 요청 온 경우
    if (
      'friend/detail' ===
        `${req.originalUrl.split('/')[1]}/${req.originalUrl.split('/')[2]}` ||
      'profile' === req.originalUrl.split('/')[1]
    ) {
      console.log('friend/detail 요청 옴');
      let friend: any;
      // '/friend/detail'
      if (
        'friend/detail' ===
        `${req.originalUrl.split('/')[1]}/${req.originalUrl.split('/')[2]}`
      ) {
        friend = await db
          .select({
            userid_num: users.userid_num,
            nickname: users.nickname,
            score_num: users.score_num,
            profile_img: users.profile_img,
          })
          .from(users)
          .where(eq(users.userid_num, Number(req.originalUrl.split('/')[3])));
      }
      // '/profile/:userid'
      else if ('profile' === req.originalUrl.split('/')[1]) {
        console.log('profile 요청 옴');
        friend = await db
          .select({
            userid_num: users.userid_num,
            nickname: users.nickname,
            score_num: users.score_num,
            profile_img: users.profile_img,
          })
          .from(users)
          .where(eq(users.userid, req.originalUrl.split('/')[2]));
      }
      friend = friend[0];
      console.log('friend > ', friend);

      let url: string;
      if (friend.profile_img !== null) {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: friend.profile_img,
        });
        url = await getSignedUrl(client, command, { expiresIn: 3600 });
      } else url = null;
      friend.profile_img = url;

      console.log('friend url  > ', friend);

      req['file'] = friend;
    }
    // '/friend' 경로로 요청 온 경우
    else if (req.baseUrl.split('/')[1] === 'friend') {
      console.log('else if /friend', req.baseUrl.split('/')[1]);
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
            userid: users.userid,
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
            userid: friend_info[i].userid,
            userid_num: friend_info[i].userid_num,
            nickname: friend_info[i].nickname,
            profile_img: url,
            score_num: friend_info[i].score_num,
          });
        } else {
          friends_info.push({
            userid: friend_info[i].userid,
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
      console.log('else req.url', req.url);
      if (
        req.url.split('/')[1] === 'normal' ||
        req.originalUrl.split('/')[1] === 'myPage' // myPage 조회
      ) {
        const body: any = req.body;
        console.log('myPage? ', req.originalUrl.split('/')[1]);
        let { filename, type } = body;

        let key;

        if (req.method === 'GET') {
          let file = await db
            .select()
            .from(users)
            .where(eq(users.userid_num, userid_num));
          key = file[0].profile_img;
          // console.log('middleware profileImg key > ', key);
          let url: string;
          if (file[0].profile_img !== null) {
            const command = new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: key,
            });
            url = await getSignedUrl(client, command, { expiresIn: 3600 });
          } else url = null;
          console.log('middleware profileImg url > ', url);
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
          // console.log('profileImg middleware body patch> ', req.body);
          let file = await db
            .select()
            .from(users)
            .where(eq(users.userid_num, userid_num));

          // console.log('patch file >> ', file[0].profile_img);

          key = file[0].profile_img;
          if (req.method === 'DELETE' || req.method === 'PATCH') {
            if (key != null) {
              const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
              };
              let command = new DeleteObjectCommand(params);
              await client.send(command);
            }
            if (req.method === 'PATCH') {
              // console.log('filename', filename);
              filename = uuid() + '.' + filename.split('.')[1];
              let command = new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: filename,
                ContentType: type,
              });

              const url = await getSignedUrl(client, command, {
                expiresIn: 3600,
              });

              console.log(url);
              req['file'] = url;
            }
          }
        }
      }
    }
    next();
  }
}
