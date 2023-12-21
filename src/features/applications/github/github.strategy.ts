/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-github2';

export type GithubAuthPayload = {
    provider: string;
    providerId: string;
    email: string;
    accessToken: string;
};

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(configService: ConfigService) {
        console.log('clientID', configService.get<string>('oauth.github.clientId'));
        console.log('clientSecret', configService.get<string>('oauth.github.clientSecret'));
        console.log('callbackURL', configService.get<string>('oauth.github.callbackURL'));
        super({
            clientID: configService.get<string>('oauth.github.clientId'),
            clientSecret: configService.get<string>('oauth.github.clientSecret'),
            callbackURL: configService.get<string>('oauth.github.callbackURL'),
            scope: [
                'repo',
                'read:user',
                'user:email',
            ],
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: any,
    ): Promise<GithubAuthPayload> {
        const {id, emails} = profile;

        return {
            provider: 'github',
            providerId: id,
            email: emails[0].value,
            accessToken: _accessToken,
        };
    }
}
