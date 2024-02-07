import { Injectable, NestMiddleware, Req, Next } from '@nestjs/common';
import { Response, Request } from 'express';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { JwtService } from '@nestjs/jwt';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { authentication, challenge } from '../modules/challenge/schema';
import { users } from '../modules/user/schema';
import { db } from '../../db/db';
import { v1 as uuid } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class s3Middleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
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

    // 로그인한 유저의 userid_num 찾아오기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;

    if (req.method === 'GET') {
      let url: string = null;
      // 인증 사진 여러개
      if (req.url.split('/')[2] === undefined) {
        // 챌린지에 참여하고 있는 모든 챌린저 정보 가져오기
        let challenger: any = await db
          .select({ challenger_userid_num: challenge.challenger_userid_num })
          .from(challenge)
          .where(
            eq(challenge.challenge_id, Number(req.originalUrl.split('/')[2])),
          );
        // 존재하지 않는 챌린지인 경우
        if (challenger.length > 0) {
          challenger = challenger[0].challenger_userid_num;

          let challenger_num = [];
          for (let i = 0; i < challenger.length; i++) {
            let id = challenger[i].userid_num;

            challenger_num.push(id);
          }

          let challengers = [];
          for (let i = 0; i < challenger_num.length; i++) {
            let info = await db
              .select({
                userid_num: users.userid_num,
                nickname: users.nickname,
                profile_img: users.profile_img,
              })
              .from(users)
              .where(eq(users.userid_num, challenger_num[i]));
            challengers.push(info[0]);
          }

          for (let i = 0; i < challengers.length; i++) {
            key = challengers[i].profile_img;
            if (key !== null) {
              const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
              });

              url = await getSignedUrl(client, command, { expiresIn: 3600 });
            }
            challengers[i] = {
              ...challengers[i],
              profile_img: url,
            };
          }

          let files = await db
            .select({
              userid_num: authentication.userid_num,
              authentication_img: authentication.authentication_img,
              authentication_id: authentication.authentication_id,
            })
            .from(authentication)
            .where(
              eq(authentication.challenge_id, Number(req.url.split('/')[1])),
            )
            .orderBy(desc(authentication.created_at));

          let urls = [];
          for (let i = 0; i < files.length; i++) {
            key = files[i].authentication_img;
            const command = new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: key,
            });

            url = await getSignedUrl(client, command, { expiresIn: 3600 });
            urls.push({
              authentication_id: files[i].authentication_id,
              userid_num: files[i].userid_num,
              url: url,
            });
          }
          req['file'] = { urls, challengers };
        } else req['file'] = null;
      } else {
        // 인증 사진 하나
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
      if (req.originalUrl.split('/')[1] === 'challengeAuth') {
        // '/challlengeAuth' 경로 요청에 대한 처리
        // 오늘 이미 인증한 사진 있으면 더 이상 사진 올리지 못하도록 막기
        let today = new Date()
          .toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
          .split(',')[0];

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

        let already = false;
        for (let i = 0; i < todayAuth.length; i++) {
          if (todayAuth[i].userid_num === userid_num) already = true;
        }

        // 오늘 이미 인증한 사진 있으면 더 이상 사진 올리지 못하도록 막기
        if (!already) {
          if (filename) {
            filename = uuid() + '.' + filename.split('.')[1];

            const command = new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: filename,
              ContentType: type,
            });

            const url = await getSignedUrl(client, command, {
              expiresIn: 3600,
            });
            //  https://awsbucket-grabit.s3.ap-northeast-2.amazonaws.com/abc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIASXWMWIHFRIO5NU3B%2F20240123%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20240123T011109Z&X-Amz-Expires=900&X-Amz-Signature=dd763b4858cb3c4b3c80d034b3378ad61b32764e02fb8f9c5e729b13cdf4919d&X-Amz-SignedHeaders=host&x-id=PutObject
            // 여기서 필요로 하는 값은 https://awsbucket-grabit.s3.ap-northeast-2.amazonaws.com/abc.png
            // 여기서 필요한 db에 저장하는 값은 abc.png

            // 컨트롤러로 req 값 전달하기
            req['file'] = url;
          } else req['file'] = null;
        }
      } else if (req.originalUrl.split('/')[1] === 'challengeDetail') {
        // '/challengeDetail' 경로에 대한 요청 처리
        const challenge_id = Number(req.originalUrl.split('/')[2]);
        let url: string = null;
        let challenger: any = await db
          .select({ challenger_userid_num: challenge.challenger_userid_num })
          .from(challenge)
          .where(eq(challenge.challenge_id, challenge_id));
        challenger = challenger[0].challenger_userid_num;
        for (let i = 0; i < challenger.length; i++) {
          challenger[i] = challenger[i].userid_num;
          let info = await db
            .select({
              userid_num: users.userid_num,
              userid: users.userid,
              nickname: users.nickname,
              profile_img: users.profile_img,
            })
            .from(users)
            .where(eq(users.userid_num, challenger[i]));
          challenger[i] = info[0];
          key = challenger[i].profile_img;
          if (key !== null) {
            const command = new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: key,
            });

            url = await getSignedUrl(client, command, { expiresIn: 3600 });
          }
          challenger[i] = {
            ...challenger[i],
            profile_img: url,
          };
        }

        req['file'] = challenger;
      }
    } else {
      // 이모티콘 DELETE 요청은 가지 않도록 하기
      if (req.originalUrl.split('/')[4] === undefined) {
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
    }
    next();
  }
}
