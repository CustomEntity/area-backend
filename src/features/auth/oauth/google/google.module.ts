/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../../../users/user.module';
import { JwtAuthModule } from '../../jwt/jwt-auth.module';
import { SystemModule } from '../../../../system/system.module';
import { GoogleService } from './google.service';

@Module({
  imports: [CqrsModule, UserModule, JwtAuthModule, SystemModule],
  controllers: [GoogleController],
  providers: [GoogleStrategy, GoogleService],
})
export class GoogleAuthModule {}
