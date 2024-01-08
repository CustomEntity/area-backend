/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-16
 **/
import { z } from 'zod';

export namespace UserConnectionAPI {
  export namespace GetUserConnections {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');
  }

  export namespace GetUserConnection {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const connectionIdSchema = z.string().refine((value) => {
      return !isNaN(Number(value));
    }, 'Invalid connection id');
  }

  export namespace DeleteUserConnection {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const connectionIdSchema = z.string().refine((value) => {
      return !isNaN(Number(value));
    }, 'Invalid connection id');
  }

  export namespace Rename {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const connectionIdSchema = z.string().refine((value) => {
      return !isNaN(Number(value));
    }, 'Invalid connection id');

    export const schema = z.object({
      name: z.string().min(1),
    });

    export const openApiSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 },
      },
    };

    export type Request = z.infer<typeof schema>;
  }
}
