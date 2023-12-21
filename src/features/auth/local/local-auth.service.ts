/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Inject, Injectable} from '@nestjs/common';
import {AuthAPI} from "../contract";
import {CommandBus} from "@nestjs/cqrs";
import {CreateUserCommand} from "../../users/commands/create-user/create-user.command";
import {ID_PROVIDER, IdProvider} from "../../../system/id/id.provider";
import {JwtAuthService} from "../jwt/jwt-auth.service";
import {Response} from "express";
import {USER_REPOSITORY, UserRepository} from "../../users/ports/user.repository";
import {HASH_PROVIDER, HashProvider} from "../../../system/hash/hash.provider";


@Injectable()
export class LocalAuthService {

    constructor(
        private readonly authService: JwtAuthService,
        @Inject(ID_PROVIDER)
        private readonly idProvider: IdProvider,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(HASH_PROVIDER)
        private readonly hashProvider: HashProvider,
        private readonly commandBus: CommandBus,
    ) {
    }

    async login(request: AuthAPI.Local.Login.Request, res: Response) {
        // TODO: Pass this to application layer because I was too lazy to do it :D
        const user = await this.userRepository.findByEmail(request.email);

        if (!user || !user.hashedPassword || !await this.hashProvider.verify(request.password, user?.hashedPassword)) {
            return res.status(400).send({message: 'Invalid credentials'});
        }
        const jwtPayload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email.value,
        };
        this.authService.login(jwtPayload, res);
        return res.status(200).send({message: 'Login successful'});
    }

    async register(request: AuthAPI.Local.Register.Request, res: Response) {
        const id = this.idProvider.getId();

        await this.commandBus.execute(
            new CreateUserCommand(
                request.firstName,
                request.lastName,
                request.email,
                id,
                request.password,
                undefined,
            ),
        );

        const jwtPayload = {
            id: id,
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email,
        };
        this.authService.login(jwtPayload, res);
        return res.status(201).send({message: 'User created successfully'});
    }
}
