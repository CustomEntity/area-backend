/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { DomainError } from '../../../shared/domain-error';

export class AppletDoesNotExistError extends DomainError {
  constructor(appletId: string) {
    super(
      'NotFound',
      'applet_does_not_exist',
      `Applet with id ${appletId} does not exist`,
    );
  }
}
