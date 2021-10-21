import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class githubStrategy extends PassportStrategy(Strategy, 'github') {

  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://localhost:8000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      displayName: profile.displayName,
      picture: photos[0].value,
      provider: profile.provider,
      provider_id: profile.id,
      accessToken
    }
    done(null, user);
  }
}
