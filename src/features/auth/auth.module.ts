/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { LocalAuthModule } from './local/local-auth.module';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GoogleAuthModule } from './oauth/google/google.module';

@Module({
  imports: [
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtAuthModule,
    LocalAuthModule,
    UserModule,
    GoogleAuthModule,
  ],
  controllers: [AuthController],
  providers: [JwtService],
})
export class AuthModule {}
