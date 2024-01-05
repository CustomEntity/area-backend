/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-05
 **/
import { KeyValueStore } from './key-value-store.provider';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisKeyValueStore implements KeyValueStore {
  constructor(private readonly connection: Redis) {}

  async delete(key: string): Promise<void> {
    await this.connection.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.connection.exists(key)) === 1;
  }

  async get(key: string): Promise<string | null> {
    return this.connection.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.connection.set(key, value, 'EX', ttl);
    } else {
      await this.connection.set(key, value);
    }
  }
}
