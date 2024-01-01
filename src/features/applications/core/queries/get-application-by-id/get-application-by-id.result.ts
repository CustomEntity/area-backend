/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IQueryResult } from '@nestjs/cqrs';
import { z } from 'zod';

const AuthenticationTypeSchema = z.enum(['oauth2', 'basic']);

const AuthenticationParametersSchema = z.record(
  z.union([z.string(), z.number(), z.array(z.string()), z.boolean()]),
);

export class GetApplicationByIdResult implements IQueryResult {
  readonly application?: {
    id: string;
    name: string;
    iconUrl: string;
    authenticationType: z.infer<typeof AuthenticationTypeSchema>;
    authenticationParameters: z.infer<typeof AuthenticationParametersSchema>;
    createdAt: Date;
  };
}
