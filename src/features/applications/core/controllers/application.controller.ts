/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindAllApplicationsQuery } from '../queries/find-all-applications/find-all-applications.query';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getApplications() {
    const applications = await this.queryBus.execute(
      new FindAllApplicationsQuery(),
    );

    console.log('aa', applications);
    return applications;
  }
}
