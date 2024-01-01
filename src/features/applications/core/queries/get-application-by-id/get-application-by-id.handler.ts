/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApplicationQueryRepository } from '../../ports/application.query-repository';
import { GetApplicationByIdQuery } from './get-application-by-id.query';
import { GetApplicationByIdResult } from './get-application-by-id.result';
import { DomainError } from '../../../../../shared/domain-error';

@QueryHandler(GetApplicationByIdQuery)
export class GetApplicationByIdHandler
  implements IQueryHandler<GetApplicationByIdQuery, GetApplicationByIdResult>
{
  constructor(
    private readonly applicationQueryRepository: ApplicationQueryRepository,
  ) {}

  async execute(
    query: GetApplicationByIdQuery,
  ): Promise<GetApplicationByIdResult> {
    const result = await this.applicationQueryRepository.findById(
      query.applicationId,
    );

    if (!result.application) {
      throw new DomainError(
        'NotFound',
        'APPLICATION_NOT_FOUND',
        `Application with id '${query.applicationId}' not found`,
      );
    }

    return result;
  }
}
