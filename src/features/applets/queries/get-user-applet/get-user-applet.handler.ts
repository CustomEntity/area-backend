/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppletQueryRepository } from '../../ports/applet.query-repository';
import { GetUserAppletQuery } from './get-user-applet.query';
import { GetUserAppletResult } from './get-user-applet.result';
import { Nullable } from '../../../../shared/nullable';
import { DomainError } from '../../../../shared/domain-error';

@QueryHandler(GetUserAppletQuery)
export class GetUserAppletHandler
  implements IQueryHandler<GetUserAppletQuery, Nullable<GetUserAppletResult>>
{
  constructor(private readonly appletQueryRepository: AppletQueryRepository) {}

  async execute(
    query: GetUserAppletQuery,
  ): Promise<Nullable<GetUserAppletResult>> {
    const { appletId } = query;

    const applet = await this.appletQueryRepository.getUserApplet(appletId);

    if (!applet) {
      throw new DomainError(
        'NotFound',
        'APPLET_NOT_FOUND',
        `Applet with id ${appletId} not found`,
      );
    }

    return applet;
  }
}
