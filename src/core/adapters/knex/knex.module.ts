/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Global, Module } from '@nestjs/common';
import { KnexService } from './knex.service';

@Global()
@Module({
  providers: [KnexService],
  exports: [KnexService],
})
export class KnexModule {}
