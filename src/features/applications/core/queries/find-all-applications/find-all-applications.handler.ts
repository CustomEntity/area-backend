/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllApplicationsQuery } from './find-all-applications.query';
import { FindAllApplicationsResult } from './find-all-applications.result';
import { ApplicationQueryRepository } from '../../ports/application.query-repository';

@QueryHandler(FindAllApplicationsQuery)
export class FindAllApplicationsHandler
  implements IQueryHandler<FindAllApplicationsQuery, FindAllApplicationsResult>
{
  constructor(
    private readonly applicationQueryRepository: ApplicationQueryRepository,
  ) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query: FindAllApplicationsQuery,
  ): Promise<FindAllApplicationsResult> {
    return await this.applicationQueryRepository.findAll();
  }
}
