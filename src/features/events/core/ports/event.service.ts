/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-21
 **/
import {z} from "zod";

export const TriggerDataSchema = z.nullable(z.record(z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()])),
])));

export const EventDataSchema = z.record(
    z.union([z.string(), z.number(), z.array(z.string()), z.boolean()]),
);

export const ConnectionCredentialsSchema = z.record(z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.union([z.string(), z.number(), z.boolean()])),
    ]));


export interface EventService {

    retrieveNewEventsData(
        applicationName: string,
        eventName: string,
        eventTriggerData: z.infer<typeof TriggerDataSchema>,
        eventConnectionCredentials: z.infer<typeof ConnectionCredentialsSchema>,
    ):
        Promise<z.infer<typeof EventDataSchema>[]>;
}