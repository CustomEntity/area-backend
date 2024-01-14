/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-13
 **/
import { z } from 'zod';

export namespace UserAPI {

  export namespace DeleteUser {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');
  }

  export namespace GetAllUsers {
    export const pageParamSchema = z.coerce.number().min(1).default(1);
    export const limitParamSchema = z.coerce
      .number()
      .min(1)
      .max(20)
      .default(20);
  }

  export namespace GetUser {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');
  }

  export namespace EditUser {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const schema = z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
    });

    export const openApiSchema = {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
      },
      example: {
        firstName: 'Flavio',
        lastName: 'Moreno',
      },
    };

    export type Request = z.infer<typeof schema>;
  }
}
