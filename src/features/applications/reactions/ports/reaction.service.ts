/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-06
 **/

export const REACTION_SERVICE = Symbol('REACTION_SERVICE');

export interface ReactionService {
  executeReaction(
    applicationName: string,
    reactionName: string,
    reactionData: Record<string, unknown>,
    reactionConnectionCredentials: Record<string, unknown>,
  ): Promise<void>;
}
