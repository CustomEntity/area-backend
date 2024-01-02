/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Injectable } from '@nestjs/common';
import { Request } from 'express';

// Don't care about this class, it's just for the area subject
@Injectable()
export class AppService {
  constructor() {}

  async getAboutJson(req: Request) {
    const dynamicContent = {
      client: {
        host: req.headers.host,
      },
      server: {
        current_time: Date.now(),
        services: [],
      },
    };

    return dynamicContent;
  }
}
