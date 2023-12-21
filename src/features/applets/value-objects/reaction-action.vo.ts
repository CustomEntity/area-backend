/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import {z} from "zod";
import {ValueObject} from "../../../shared/value-object";

export const ReactionActionSchema = z.nullable(z.record(z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()])),
])));

export class ReactionAction extends ValueObject<z.infer<typeof ReactionActionSchema>> {
    private constructor(value: z.infer<typeof ReactionActionSchema>) {
        super(value);
    }

    public static create(value: unknown): ReactionAction {
        const parsedData = ReactionActionSchema.parse(value);
        return new ReactionAction(parsedData);
    }
}
