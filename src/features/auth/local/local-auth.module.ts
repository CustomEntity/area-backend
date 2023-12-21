/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Module} from '@nestjs/common';
import {LocalAuthController} from "./local-auth.controller";
import {CqrsModule} from "@nestjs/cqrs";
import {UserModule} from "../../users/user.module";
import {JwtAuthModule} from "../jwt/jwt-auth.module";
import {SystemModule} from "../../../system/system.module";
import {LocalAuthService} from "./local-auth.service";

@Module({
  imports: [CqrsModule, UserModule, JwtAuthModule, SystemModule],
  controllers: [LocalAuthController],
  providers: [LocalAuthService],
})
export class LocalAuthModule {}
