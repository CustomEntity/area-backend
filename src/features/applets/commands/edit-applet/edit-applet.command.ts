/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { ICommand } from '@nestjs/cqrs';
import { z } from 'zod';

const TriggerDataSchema = z
  .nullable(
    z.record(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.union([z.string(), z.number(), z.boolean()])),
      ]),
    ),
  )
  .optional();

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
  active?: boolean;
};

export class EditAppletCommand implements ICommand {
  constructor(public readonly params: EditAppletCommandParams) {}
}
