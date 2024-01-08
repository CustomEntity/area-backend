/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-spotify';

import e from 'express';
import { Profile } from 'passport-spotify';

export type SpotifyAuthPayload = {
  provider: string;
  username: string;
  displayName: string;
  profileUrl: string | null;
  photos: [string] | null;
  email: string;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('oauth.spotify.clientId'),
      clientSecret: configService.get<string>('oauth.spotify.clientSecret'),
      callbackURL: configService.get<string>('oauth.spotify.callbackURL'),
      scope: [
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read',
        'user-library-modify',
        'user-top-read',
        'user-read-recently-played',
        'user-follow-read',
        'user-follow-modify',
      ],
      showDialog: true,
    });
  }

  authenticate(req: e.Request, options?: any) {
    const returnTo = req.query.returnTo as string;

    if (returnTo) {
      const cryptedReturnTo = Buffer.from(returnTo).toString('base64');

      super.authenticate(req, {
        ...options,
        state: cryptedReturnTo,
      });
      return;
    }

    super.authenticate(req, options);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<SpotifyAuthPayload> {
    if (!profile || !profile.emails || !profile.emails[0]) {
      throw new Error('Invalid spotify profile');
    }
    return {
      provider: 'spotify',
      username: profile.username,
      displayName: profile.displayName,
      profileUrl: profile.profileUrl,
      photos: profile.photos,
      email: profile.emails[0].value,
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    };
  }
}
