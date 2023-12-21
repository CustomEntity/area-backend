/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {JwtAuthStrategy} from './jwt-auth.strategy';
import {JwtAuthService} from './jwt-auth.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('jwtSecret'),
                    signOptions: {
                        expiresIn: configService.get<string>('jwtExpiresIn'),
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [JwtAuthStrategy, JwtAuthService],
    exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {
}
