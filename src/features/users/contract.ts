/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-13
 **/
import { z } from 'zod';

export namespace UserAPI {
  export namespace GetAllUsers {
    export const pageParamSchema = z.coerce.number().min(1).default(1);
    export const limitParamSchema = z.coerce.number().min(1).max(20).default(20);
  }
}
