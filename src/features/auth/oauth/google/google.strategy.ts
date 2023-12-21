/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-google-oauth20';
import e from 'express';

export type GoogleAuthPayload = {
    provider: string;
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('oauth.google.clientId'),
            clientSecret: configService.get<string>('oauth.google.clientSecret'),
            callbackURL: configService.get<string>('oauth.google.callbackURL'),
            scope: ['profile', 'email'],
            prompt: 'consent',
            accessType: 'offline',
        });
    }

    authenticate(req: e.Request, options?: any) {
        const returnTo = req.query.returnTo as string;

        if (returnTo) {
            const cryptedReturnTo = Buffer.from(returnTo).toString('base64');

            super.authenticate(req, {
                ...options,
                accessType: 'offline',
                prompt: 'consent',
                state: cryptedReturnTo,
            });
            return;
        }
        super.authenticate(req, {
            ...options,
            accessType: 'offline',
            prompt: 'consent',
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: any,
    ): Promise<GoogleAuthPayload> {
        const {id, name, emails, photos} = profile;
        const user = {
            provider: 'google',
            providerId: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            profilePictureUrl: photos[0].value,
        };

        return user;
    }
}
