/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/

import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    try {
      this.redis = new Redis({
        host: this.configService.get<string>('redis.host'),
        port: this.configService.get<number>('redis.port'),
        password: this.configService.get<string>('redis.password'),
        tls: {},
      });

      this.redis.on('connect', () => {
        this.logger.log('RedisService: Connected to Redis');
      });

      this.redis.on('error', (error) => {
        this.logger.error('RedisService: Connection error', error.stack);
      });
    } catch (error) {
      this.logger.error('Error initializing RedisService', error.stack);
      throw error;
    }
  }

  get connection(): Redis {
    return this.redis;
  }
}
