/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { DiscoveryModule } from '@nestjs/core';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
