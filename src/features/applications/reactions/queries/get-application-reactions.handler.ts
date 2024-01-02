/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainError } from '../../../../shared/domain-error';
import { GetApplicationReactionsQuery } from './get-application-reactions.query';
import { GetApplicationReactionsResult } from './get-application-reactions.result';
import { ApplicationReactionQueryRepository } from '../ports/application-reaction.query-repository';

@QueryHandler(GetApplicationReactionsQuery)
export class GetApplicationReactionsHandler
  implements
    IQueryHandler<GetApplicationReactionsQuery, GetApplicationReactionsResult>
{
  constructor(
    private readonly applicationReactionQueryRepository: ApplicationReactionQueryRepository,
  ) {}

  async execute(
    query: GetApplicationReactionsQuery,
  ): Promise<GetApplicationReactionsResult> {
    const result =
      await this.applicationReactionQueryRepository.findReactionsByApplicationId(
        query.applicationId,
      );

    if (!result.reactions) {
      throw new DomainError(
        'NotFound',
        'APPLICATION_NOT_FOUND',
        `Application with id '${query.applicationId}' not found.`,
      );
    }

    return result;
  }
}
