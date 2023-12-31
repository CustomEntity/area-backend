/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/
import { DomainError } from '../../../shared/domain-error';

export class UserConnectionDoesNotExistError extends DomainError {
  constructor(userConnectionId: string) {
    super(
      'NotFound',
      'user-connection-does-not-exist',
      `The user connection with id ${userConnectionId} does not exist`,
    );
  }
}
