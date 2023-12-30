/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-16
 **/
import { z } from 'zod';

export namespace UserConnectionAPI {
  export namespace Rename {
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
