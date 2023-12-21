/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByEmailQuery } from './find-user-by-email.query';
import { FindUserByEmailResult } from './find-user-by-email.result';
import { UserQueryRepository } from '../../ports/user.query-repository';
import { Nullable } from '../../../../shared/nullable';

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailHandler
  implements
    IQueryHandler<FindUserByEmailQuery, Nullable<FindUserByEmailResult>>
{
  constructor(private readonly userQueryRepository: UserQueryRepository) {}

  async execute(
    query: FindUserByEmailQuery,
  ): Promise<Nullable<FindUserByEmailResult>> {
    const user = await this.userQueryRepository.findByEmail(query.email);

    if (!user) {
      return null;
    }

    return user;
  }
}
