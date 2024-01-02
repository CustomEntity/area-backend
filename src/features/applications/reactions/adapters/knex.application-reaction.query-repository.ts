/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { ApplicationReactionQueryRepository } from '../ports/application-reaction.query-repository';
import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { GetApplicationReactionsResult } from '../queries/get-application-reactions.result';

const APPLICATION_TABLE = 'applications';
const APPLICATION_REACTION_TABLE = 'application_reactions';

@Injectable()
export class KnexApplicationReactionQueryRepository
  implements ApplicationReactionQueryRepository
{
  constructor(private readonly connection: Knex) {}

  async findReactionsByApplicationId(
    applicationId: string,
  ): Promise<GetApplicationReactionsResult> {
    const application = await this.connection(APPLICATION_TABLE)
      .select()
      .where('id', applicationId)
      .first();

    if (!application) {
      return {
        reactions: undefined,
      };
    }
    const events = await this.connection(APPLICATION_REACTION_TABLE)
      .select()
      .where('application_id', applicationId);

    return {
      reactions: events.map((event) => ({
        id: event.id,
        applicationId: event.application_id,
        name: event.name,
        description: event.description,
        parametersMapping: event.parameters_mapping,
        createdAt: event.created_at,
      })),
    };
  }
}
