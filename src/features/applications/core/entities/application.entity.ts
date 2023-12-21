/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Entity } from '../../../../shared/entity';
import { AuthenticationType } from '../value-objects/authentication-type.vo';
import { AuthenticationParameters } from '../value-objects/authentication-parameters.vo';
import { AuthenticationSecrets } from '../value-objects/authentication-secrets.vo';

export type ApplicationData = {
  id: string;
  name: string;
  iconUrl: string;
  authenticationType: AuthenticationType;
  authenticationParameters: AuthenticationParameters;
  authenticationSecrets: AuthenticationSecrets;
  createdAt: Date;
};

export class Application extends Entity<ApplicationData> {
  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get iconUrl(): string {
    return this.data.iconUrl;
  }

  get authenticationType(): AuthenticationType {
    return this.data.authenticationType;
  }

  get authenticationParameters(): AuthenticationParameters {
    return this.data.authenticationParameters;
  }

  get authenticationSecrets(): AuthenticationSecrets {
    return this.data.authenticationSecrets;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }
}
