/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {Event} from '../../../system/event/event-dispatcher.provider';
import {z} from "zod";

const ConnectionCredentialsSchema = z.union([
    z.string(),
    z.object({
        username: z.string(),
        password: z.string(),
    }),
    z.object({
        access_token: z.string(),
        refresh_token: z.string().optional(),
    }),
]);

export class UserConnectionCreatedEvent implements Event {

    constructor(
        public readonly userId: string,
        public readonly connectionId: string,
        public readonly connectionName: string,
        public readonly connectionCredentials: z.infer<typeof ConnectionCredentialsSchema>,
    ) {
    }

    getName(): string {
        return UserConnectionCreatedEvent.name;
    }
}