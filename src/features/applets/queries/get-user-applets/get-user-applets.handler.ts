/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/
import { GetUserAppletsQuery } from './get-user-applets.query';
import { GetUserAppletsResult } from './get-user-applets.result';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppletQueryRepository } from '../../ports/applet.query-repository';
import { DomainError } from '../../../../shared/domain-error';

@QueryHandler(GetUserAppletsQuery)
export class GetUserAppletsHandler
  implements IQueryHandler<GetUserAppletsQuery, GetUserAppletsResult>
{
  constructor(private readonly appletQueryRepository: AppletQueryRepository) {}

  async execute(query: GetUserAppletsQuery): Promise<GetUserAppletsResult> {
    const { userId } = query;

    const applets = await this.appletQueryRepository.getUserApplets(userId);

    if (!applets.applets) {
      throw new DomainError(
        'NotFound',
        'USER_NOT_FOUND',
        `User with id '${userId}' not found`,
      );
    }

    return applets;
  }
}
