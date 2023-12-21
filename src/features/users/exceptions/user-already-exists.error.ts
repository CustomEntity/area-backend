/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/
import {DomainError} from "../../../shared/domain-error";


export class UserAlreadyExistsError extends DomainError{
  constructor(email: string) {
    super(
        'Conflict',
        'user-already-exists',
        `User with email ${email} already exists`,
    );
  }
}
