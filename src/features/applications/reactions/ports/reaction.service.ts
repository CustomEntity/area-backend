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

export interface ReactionService {
  executeReaction(
    applicationName: string,
    reactionName: string,
    reactionParametersData:
      | z.infer<typeof ReactionParametersDataSchema>
      | undefined,
    reactionData: Record<string, unknown>,
    reactionConnectionCredentials: Record<string, unknown>,
  ): Promise<void>;
}
