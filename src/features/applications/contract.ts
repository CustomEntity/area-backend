/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-01
 **/
import { z } from 'zod';

export namespace ApplicationAPI {
  export namespace GetApplicationById {
    export const applicationIdSchema = z.string().refine((value) => {
      return !isNaN(Number(value));
    }, 'Invalid application id');
  }

  export namespace GetApplicationEvents {
    export const applicationIdSchema = z.string().refine((value) => {
      return !isNaN(Number(value));
    }, 'Invalid application id');
  }
}
