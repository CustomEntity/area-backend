/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { DomainError } from '../../../../shared/domain-error';

export class ApplicationDoesNotExistError extends DomainError {
  constructor(applicationName: string) {
    super(
        'NotFound',
        'application-does-not-exist',
        `The application ${applicationName} does not exist`,
    );
  }
}
