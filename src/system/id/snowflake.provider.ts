/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { IdProvider } from './id.provider';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import Snowflakify from 'snowflakify';

@Injectable()
export class SnowflakeIdProvider implements IdProvider {
  private readonly snowflakify = new Snowflakify();

  constructor(private readonly configService: ConfigService) {
    const epoch = this.configService.get('systemEpoch');

    this.snowflakify = new Snowflakify({
      epoch: epoch,
      preset: 'ipv4',
    });
  }

  getId(): string {
    return this.snowflakify.nextId().toString();
  }
}
