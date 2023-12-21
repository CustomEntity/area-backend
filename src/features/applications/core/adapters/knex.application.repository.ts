/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from '../ports/application.repository';
import { Nullable } from '../../../../shared/nullable';
import { Application } from '../entities/application.entity';
import { Knex } from 'knex';
import { Mapper } from '../../../../shared/mapper';
import { AuthenticationParameters } from '../value-objects/authentication-parameters.vo';
import { AuthenticationType } from '../value-objects/authentication-type.vo';
import { AuthenticationSecrets } from '../value-objects/authentication-secrets.vo';

const APPLICATION_TABLE = 'applications';

@Injectable()
export class KnexApplicationRepository implements ApplicationRepository {
  private readonly mapper: KnexApplicationMapper = new KnexApplicationMapper();

  constructor(private readonly connection: Knex) {}

  async findAll(): Promise<Application[]> {
    const applications = await this.connection(APPLICATION_TABLE).select();

    return applications.map((application) => this.mapper.toEntity(application));
  }

  async findById(id: string): Promise<Nullable<Application>> {
    const application = await this.connection(APPLICATION_TABLE)
      .select()
      .where('id', id)
      .first();

    if (!application) {
      return null;
    }

    return this.mapper.toEntity(application);
  }

  async findByName(name: string): Promise<Nullable<Application>> {
    const application = await this.connection(APPLICATION_TABLE)
      .select()
      .where('name', name)
      .first();

    if (!application) {
      return null;
    }

    return this.mapper.toEntity(application);
  }
}

class KnexApplicationMapper extends Mapper<Application> {
  toEntity(data: any): Application {
    return new Application({
      id: data.id,
      name: data.name,
      iconUrl: data.icon_url,
      authenticationType: AuthenticationType.create(data.authentication_type),
      authenticationParameters: AuthenticationParameters.create(
        data.authentication_parameters,
      ),
      authenticationSecrets: AuthenticationSecrets.create(
        data.authentication_secrets,
      ),
      createdAt: data.created_at,
    });
  }

  toPersistence(entity: Application): any {
    return {
      id: entity.id,
      name: entity.name,
      icon_url: entity.iconUrl,
      authentication_type: entity.authenticationType.value,
      authentication_parameters: entity.authenticationParameters.value,
      authentication_secrets: entity.authenticationSecrets.value,
      created_at: entity.createdAt,
    };
  }
}
