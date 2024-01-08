/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-06
 **/
import { z } from 'zod';

export const REACTION_SERVICE = Symbol('REACTION_SERVICE');

export const ReactionParametersDataSchema = z.nullable(
  z.record(
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.union([z.string(), z.number(), z.boolean()])),
    ]),
  ),
);

export const ConnectionCredentialsSchema = z.union([
  z.object({
    access_token: z.string(),
    refresh_token: z.string().optional(),
  }),
  z.object({
    api_key: z.string(),
  }),
]);

export const EventDataSchema = z.record(z.string().optional().nullable());

export interface ReactionService {
  executeReaction(
    applicationName: string,
    reactionName: string,
    eventData: z.infer<typeof EventDataSchema>,
    reactionParametersData?: z.infer<typeof ReactionParametersDataSchema>,
    reactionConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<void>;
}
