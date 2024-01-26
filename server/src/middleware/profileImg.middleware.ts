import { Injectable, NestMiddleware, Request, Next } from '@nestjs/common';
import { Response } from 'express';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and, desc, eq } from 'drizzle-orm';
import { users } from '../modules/user/schema';
import { db } from '../../db/db';
import { v1 as uuid } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class profileImgMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: (error?: any) => void) {
    if (req.url.split('/')[1] === 'normal') {
      const body: any = req.body;
      console.log('profileImg middleware body > ', body);
      let { filename, type } = body;

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

        key = file[0].profile_img;

        console.log('middleware profileImg key > ', key);

        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 3600 });

        req['file'] = url;
      } else if (req.method === 'POST') {
        if (filename) {
          key = uuid() + '.' + filename.split('.')[1];
          const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            ContentType: type,
          });
          const url = await getSignedUrl(client, command, { expiresIn: 3600 });
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
}
