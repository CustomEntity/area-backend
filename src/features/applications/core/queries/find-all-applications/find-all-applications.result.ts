/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryResult } from '@nestjs/cqrs';
import { z } from 'zod';

const AuthenticationTypeSchema = z.enum(['oauth2', 'basic', 'apikey', 'none']);

const AuthenticationParametersSchema = z.nullable(z.record(z.any()));

export class FindAllApplicationsResult implements IQueryResult {
  readonly applications: {
    id: string;
    name: string;
    iconUrl: string;
    authenticationType: z.infer<typeof AuthenticationTypeSchema>;
    authenticationParameters: z.infer<typeof AuthenticationParametersSchema>;
    createdAt: Date;
  }[];
}
