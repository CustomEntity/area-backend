/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { HashProvider } from './hash.provider';
import { argon2d, hash, verify } from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArgonHashProvider implements HashProvider {
  hash(data: string): Promise<string> {
    return hash(data, {
      type: argon2d,
    });
  }

  verify(data: string, hash: string): Promise<boolean> {
    return verify(hash, data);
  }
}
