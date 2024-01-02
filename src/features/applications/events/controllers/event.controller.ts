/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../../core/pipes/zod-validation-pipe';
import { ApplicationAPI } from '../../contract';
import { QueryBus } from '@nestjs/cqrs';
import { GetApplicationEventsQuery } from '../queries/get-application-events.query';

@Controller('applications')
@ApiTags('applications')
export class EventController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':applicationId/events')
  @ApiOperation({ summary: 'Get application events' })
  @ApiResponse({
    status: 200,
    description: 'Get application events',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async getApplicationEvents(
    @Param(
      'applicationId',
      new ZodValidationPipe(
        ApplicationAPI.GetApplicationEvents.applicationIdSchema,
      ),
    )
    applicationId: string,
  ) {
    return await this.queryBus.execute(
      new GetApplicationEventsQuery(applicationId),
    );
  }
}
