/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Module } from '@nestjs/common';
import { DATE_PROVIDER } from './date/date.provider';
import { ID_PROVIDER } from './id/id.provider';
import { SnowflakeIdProvider } from './id/snowflake.provider';
import { HASH_PROVIDER, HashProvider } from './hash/hash.provider';
import { ArgonHashProvider } from './hash/argon-hash.provider';
import { CurrentDateProvider } from './date/current-date.provider';
import { ConfigService } from '@nestjs/config';
import { EVENT_DISPATCHER } from './event/event-dispatcher.provider';
import { NodeEventDispatcher } from './event/node-event-dispatcher.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: DATE_PROVIDER,
      useFactory: (currentDateProvider: CurrentDateProvider) => {
        return currentDateProvider;
      },
      inject: [CurrentDateProvider],
    },
    {
      provide: CurrentDateProvider,
      useFactory: () => {
        return new CurrentDateProvider();
      },
    },
    {
      provide: ID_PROVIDER,
      useFactory: (snowflakeIdProvider: SnowflakeIdProvider) => {
        return snowflakeIdProvider;
      },
      inject: [SnowflakeIdProvider],
    },
    SnowflakeIdProvider,
    {
      provide: HASH_PROVIDER,
      useFactory: (hashProvider: HashProvider) => {
        return hashProvider;
      },
      inject: [ArgonHashProvider],
    },
    {
      provide: ArgonHashProvider,
      useFactory: () => {
        return new ArgonHashProvider();
      },
    },
    {
      provide: EVENT_DISPATCHER,
      useClass: NodeEventDispatcher,
    },
  ],
  exports: [DATE_PROVIDER, ID_PROVIDER, HASH_PROVIDER, EVENT_DISPATCHER],
})
export class SystemModule {}
