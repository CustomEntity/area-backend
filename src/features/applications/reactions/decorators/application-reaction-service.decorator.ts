/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-04
 **/
import { SetMetadata } from '@nestjs/common';

export const APPLICATION_REACTION_SERVICE_METADATA = Symbol(
  'APPLICATION_REACTION_SERVICE_METADATA',
);

export const ApplicationReactionService = (applicationName: string) =>
  SetMetadata(APPLICATION_REACTION_SERVICE_METADATA, applicationName);
