/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { GetApplicationEventsQuery } from './get-application-events.query';
import { GetApplicationEventsResult } from './get-application-events.result';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApplicationEventQueryRepository } from '../ports/event.query-repository';
import { DomainError } from '../../../../shared/domain-error';

@QueryHandler(GetApplicationEventsQuery)
export class GetApplicationEventsHandler
  implements
    IQueryHandler<GetApplicationEventsQuery, GetApplicationEventsResult>
{
  constructor(
    private readonly applicationEventQueryRepository: ApplicationEventQueryRepository,
  ) {}

  async execute(
    query: GetApplicationEventsQuery,
  ): Promise<GetApplicationEventsResult> {
    const result =
      await this.applicationEventQueryRepository.findEventsByApplicationId(
        query.applicationId,
      );

    if (!result.events) {
      throw new DomainError(
        'NotFound',
        'APPLICATION_NOT_FOUND',
        `Application with id '${query.applicationId}' not found.`,
      );
    }

    return result;
  }
}
