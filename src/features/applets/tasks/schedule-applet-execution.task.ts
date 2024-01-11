/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommandBus } from '@nestjs/cqrs';
import { ScheduleAllAppletsExecutionCommand } from '../commands/schedule-all-applets-execution/schedule-all-applets-execution.command';

@Injectable()
export class ScheduleAppletExecutionTask {
  constructor(private readonly commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.commandBus.execute(new ScheduleAllAppletsExecutionCommand());
  }
}
