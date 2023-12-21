/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { DateProvider } from './date.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrentDateProvider implements DateProvider {
  public getDate(): Date {
    return new Date(Date.now());
  }
}
