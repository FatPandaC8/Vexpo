import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  // google one tap is not the same as log in with google
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URI,
      scope: ['email', 'profile'],
    });
  }

  // verify callback is where you tell passport how to interact with your user store
  // whether the credential are valid | return a full user if GUD else null
  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
      picture: photos[0]?.value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
