/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-21
 **/

import {z} from "zod";
import {ValueObject} from "../../../shared/value-object";

export const ApplicationData = z.object({
    id: z.string(),
    name: z.string()
});

export class Application extends ValueObject<z.infer<typeof ApplicationData>> {
    private constructor(value: z.infer<typeof ApplicationData>) {
        super(value);
    }

    public static create(value: unknown): Application {
        const parsedData = ApplicationData.parse(value);
        return new Application(parsedData);
    }
}