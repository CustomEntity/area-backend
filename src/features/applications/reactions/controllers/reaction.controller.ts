/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../../core/pipes/zod-validation-pipe';
import { ApplicationAPI } from '../../contract';
import { GetApplicationReactionsQuery } from '../queries/get-application-reactions.query';

@Controller('applications')
@ApiTags('applications')
export class ReactionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':applicationId/reactions')
  @ApiOperation({ summary: 'Get application reactions' })
  @ApiResponse({
    status: 200,
    description: 'Get application reactions',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async getApplicationReactions(
    @Param(
      'applicationId',
      new ZodValidationPipe(
        ApplicationAPI.GetApplicationReactions.applicationIdSchema,
      ),
    )
    applicationId: string,
  ) {
    return await this.queryBus.execute(
      new GetApplicationReactionsQuery(applicationId),
    );
  }
}
