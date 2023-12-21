/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-16
 **/
import {z} from "zod";

export namespace AuthAPI {
    export namespace Local {

        export namespace Register {
            export const schema = z.object({
                firstName: z.string().min(1),
                lastName: z.string().min(1),
                email: z.string().email(),
                password: z.string().min(8),
            });

            export type Request = z.infer<typeof schema>;
        }

        export namespace Login {
            export const schema = z.object({
                email: z.string().email(),
                password: z.string().min(8),
            });

            export type Request = z.infer<typeof schema>;
        }
    }
}