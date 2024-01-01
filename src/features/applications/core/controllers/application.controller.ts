/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindAllApplicationsQuery } from '../queries/find-all-applications/find-all-applications.query';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationAPI } from '../../contract';
import { ZodValidationPipe } from '../../../../core/pipes/zod-validation-pipe';
import { GetApplicationByIdQuery } from '../queries/get-application-by-id/get-application-by-id.query';

@Controller('applications')
@ApiTags('applications')
export class ApplicationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Get all applications' })
  @ApiResponse({
    status: 200,
    description: 'Get all applications',
  })
  async getApplications() {
    return await this.queryBus.execute(new FindAllApplicationsQuery());
  }

  @Get(':applicationId')
  @ApiOperation({ summary: 'Get application by id' })
  @ApiResponse({
    status: 200,
    description: 'Get application by id',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async getApplicationById(
    @Param(
      'applicationId',
      new ZodValidationPipe(
        ApplicationAPI.GetApplicationById.applicationIdSchema,
      ),
    )
    applicationId: string,
  ) {
    return await this.queryBus.execute(
      new GetApplicationByIdQuery(applicationId),
    );
  }
}
