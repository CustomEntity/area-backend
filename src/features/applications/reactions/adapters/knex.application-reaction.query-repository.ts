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
    const results = await this.connection(APPLICATION_TABLE)
      .leftJoin(
        APPLICATION_REACTION_TABLE,
        `${APPLICATION_TABLE}.id`,
        '=',
        `${APPLICATION_REACTION_TABLE}.application_id`,
      )
      .select(
        `${APPLICATION_TABLE}.id as application_id`,
        `${APPLICATION_REACTION_TABLE}.id`,
        `${APPLICATION_REACTION_TABLE}.name`,
        `${APPLICATION_REACTION_TABLE}.description`,
        `${APPLICATION_REACTION_TABLE}.parameters_mapping`,
        `${APPLICATION_REACTION_TABLE}.created_at`,
      )
      .where(`${APPLICATION_TABLE}.id`, applicationId);

    if (!results || results.length === 0 || !results[0].application_id) {
      return {
        reactions: undefined,
      };
    }

    const reactions = results.filter((result) => result.id != null);

    return {
      reactions: reactions.map((reaction) => ({
        id: reaction.id,
        applicationId: reaction.application_id,
        name: reaction.name,
        description: reaction.description,
        parametersMapping: reaction.parameters_mapping,
        createdAt: reaction.created_at,
      })),
    };
  }
}
