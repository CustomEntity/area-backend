/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/
import { DomainError } from '../../../shared/domain-error';

export class CannotAccessOtherConnectionError extends DomainError {
  constructor() {
    super(
      'Forbidden',
      'cannot-access-other-connection',
      `You cannot access other user connection`,
    );
  }
}
