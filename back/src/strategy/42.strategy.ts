import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class qdStrategy extends PassportStrategy(Strategy, '42') {

  constructor() {
    super({
      clientID: process.env.QD_USER_ID,
      clientSecret: process.env.QD_SECRET,
      callbackURL: 'http://localhost:8000/auth/42/callback',
      scope: ['public'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    }
    done(null, user);
  }
}