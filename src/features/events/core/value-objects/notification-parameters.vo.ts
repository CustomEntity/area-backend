/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import {ValueObject} from '../../../../shared/value-object';
import {z} from 'zod';

export const NotificationParametersSchema = z.record(
    z.union([z.string(), z.number(), z.array(z.string()), z.boolean()]),
);

export class NotificationParameters extends ValueObject<
    z.infer<typeof NotificationParametersSchema>
> {
    private constructor(value: z.infer<typeof NotificationParametersSchema>) {
        super(value);
    }

    public static create(value: unknown): NotificationParameters {
        const parsedValue = NotificationParametersSchema.parse(value);
        return new NotificationParameters(parsedValue);
    }
}
