/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-06
 **/

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ReactionService } from '../ports/reaction.service';

@Injectable()
export class ConcreteReactionService implements ReactionService, OnModuleInit {
  executeReaction(
    applicationName: string,
    reactionName: string,
    reactionData: Record<string, unknown>,
    reactionConnectionCredentials: Record<string, unknown>,
  ): Promise<void> {
    return Promise.resolve(undefined);
  }

  onModuleInit(): any {}
}
