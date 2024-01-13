/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { FindUserByIdResult } from './find-user-by-id.result';
import { UserDoesNotExistError } from '../../exceptions/user-does-not-exist.error';
import { UserQueryRepository } from '../../ports/user.query-repository';
import { Nullable } from '../../../../shared/nullable';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler
  implements IQueryHandler<FindUserByIdQuery, Nullable<FindUserByIdResult>>
{
  constructor(private readonly userQueryRepository: UserQueryRepository) {}

  async execute(
    query: FindUserByIdQuery,
  ): Promise<Nullable<FindUserByIdResult>> {
    const user = await this.userQueryRepository.findById(query.id);

    if (!user) {
      throw new UserDoesNotExistError(query.id);
    }

    return user;
  }
}
