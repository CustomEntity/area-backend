/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommandBus } from '@nestjs/cqrs';
import { ScheduleAllAppletsExecutionCommand } from '../commands/schedule-all-applets-execution/schedule-all-applets-execution.command';
import Redis from 'ioredis';

const LOCK_KEY = 'schedule-applet-execution-task-lock';
const LOCK_TIMEOUT = 60;

@Injectable()
export class ScheduleAppletExecutionTask {
  constructor(
    private readonly redis: Redis,
    private readonly commandBus: CommandBus,
  ) {}

  async acquireLock(lockKey: string, lockTimeout: number) {
    const lock = await this.redis.set(
      lockKey,
      'locked',
      'EX',
      lockTimeout,
      'NX',
    );
    return lock === 'OK';
  }

  async releaseLock(lockKey: string) {
    await this.redis.del(lockKey);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    console.log('Running cron task');
    if (await this.acquireLock(LOCK_KEY, LOCK_TIMEOUT)) {
      console.log('Lock acquired');
      try {
        await this.commandBus.execute(new ScheduleAllAppletsExecutionCommand());
      } finally {
        await this.releaseLock(LOCK_KEY);
      }
    }
  }
}
