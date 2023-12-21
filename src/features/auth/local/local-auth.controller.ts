/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Body, Controller, HttpCode, Post, Res} from '@nestjs/common';
import {Response} from "express";
import {ZodValidationPipe} from "../../../core/pipes/zod-validation-pipe";
import {AuthAPI} from "../contract";
import {LocalAuthService} from "./local-auth.service";

@Controller('auth')
export class LocalAuthController {

    constructor(
        private readonly localAuthService: LocalAuthService,
    ) {
    }

    @Post('register')
    @HttpCode(201)
    async register(@Body(new ZodValidationPipe(AuthAPI.Local.Register.schema)) body: AuthAPI.Local.Register.Request,
                   @Res() res: Response
    ) {
        return await this.localAuthService.register(body, res)
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body(new ZodValidationPipe(AuthAPI.Local.Login.schema)) body: AuthAPI.Local.Login.Request,
                @Res() res: Response) {
       return await this.localAuthService.login(body, res);
    }
}
