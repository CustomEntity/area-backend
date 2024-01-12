/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { ICommand } from '@nestjs/cqrs';
import { z } from 'zod';

const TriggerDataSchema = z.nullable(
  z.record(
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.union([z.string(), z.number(), z.boolean()])),
    ]),
  ),
);

const ReactionParametersDataSchema = z.nullable(
  z.record(
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.union([z.string(), z.number(), z.boolean()])),
    ]),
  ),
);

export class CreateAppletCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly userId: string,
    public readonly eventId: string,
    public readonly reactionId: string,
    public readonly reactionParametersData: z.infer<
      typeof ReactionParametersDataSchema
    >,
    public readonly eventTriggerData?: z.infer<typeof TriggerDataSchema>,
    public readonly eventConnectionId?: string,
    public readonly reactionConnectionId?: string,
  ) {}
}
