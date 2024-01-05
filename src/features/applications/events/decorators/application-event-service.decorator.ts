/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-04
 **/
import { SetMetadata } from '@nestjs/common';

export const APPLICATION_EVENT_SERVICE_METADATA = Symbol(
  'APPLICATION_EVENT_SERVICE_METADATA',
);

export const ApplicationEventService = (applicationName: string) =>
  SetMetadata(APPLICATION_EVENT_SERVICE_METADATA, applicationName);
