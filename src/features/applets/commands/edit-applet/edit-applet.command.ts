/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { ICommand } from '@nestjs/cqrs';
import { z } from 'zod';

const TriggerDataSchema = z.record(
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()])),
  ]),
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

type EditAppletCommandParams = {
  id: string;
  name?: string;
  description?: string;
  eventId?: string;
  reactionId?: string;
  eventConnectionId?: string;
  reactionConnectionId?: string;
  eventTriggerData?: z.infer<typeof TriggerDataSchema>;
  reactionParametersData?: z.infer<typeof ReactionParametersDataSchema>;
};

export class EditAppletCommand implements ICommand {
  constructor(public readonly params: EditAppletCommandParams) {}
}
