/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { DomainError } from '../../../shared/domain-error';

export class UserDoesNotExistError extends DomainError {
  constructor(userId: string) {
    super(
      'NotFound',
      'user_does_not_exist',
      `User with id ${userId} does not exist`,
    );
  }
}
