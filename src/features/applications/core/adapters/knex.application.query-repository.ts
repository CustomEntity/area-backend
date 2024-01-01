/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ApplicationQueryRepository } from '../ports/application.query-repository';
import { FindAllApplicationsResult } from '../queries/find-all-applications/find-all-applications.result';
import { GetApplicationByIdResult } from '../queries/get-application-by-id/get-application-by-id.result';

@Injectable()
export class KnexApplicationQueryRepository
  implements ApplicationQueryRepository
{
  constructor(private readonly connection: Knex) {}

  async findById(id: string): Promise<GetApplicationByIdResult> {
    const application = await this.connection('applications')
      .select()
      .where('id', id)
      .first();

    if (!application) {
      return {
        application: undefined,
      };
    }

    return {
      application: {
        id: application.id,
        name: application.name,
        iconUrl: application.icon_url,
        authenticationType: application.authentication_type,
        authenticationParameters: application.authentication_parameters,
        createdAt: application.created_at,
      },
    };
  }

  async findAll(): Promise<FindAllApplicationsResult> {
    const applications = await this.connection('applications').select();

    return {
      applications: applications.map((application) => {
        return {
          id: application.id,
          name: application.name,
          iconUrl: application.icon_url,
          authenticationType: application.authentication_type,
          authenticationParameters: application.authentication_parameters,
          createdAt: application.created_at,
        };
      }),
    };
  }
}
