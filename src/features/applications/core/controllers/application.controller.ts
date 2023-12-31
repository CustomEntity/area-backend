/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindAllApplicationsQuery } from '../queries/find-all-applications/find-all-applications.query';
import { ApiTags } from '@nestjs/swagger';

@Controller('applications')
@ApiTags('applications')
export class ApplicationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getApplications() {
    const applications = await this.queryBus.execute(
      new FindAllApplicationsQuery(),
    );

    return applications;
  }
}
