/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly zodSchema: z.Schema<any>) {}

  transform(value: any) {
    const result = this.zodSchema.safeParse(value);
    if (!result.success) {
      const errors = result.error.issues[0].message.split('.')[0];
      const path = result.error.issues[0].path[0];
      throw new BadRequestException(
        "Validation failed for '" + path + "' field: " + errors,
      );
    }

    return result.data;
  }
}
