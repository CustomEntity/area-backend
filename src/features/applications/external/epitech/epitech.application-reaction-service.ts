/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-09
 **/

import { ApplicationReactionService } from '../../reactions/decorators/application-reaction-service.decorator';
import { ApplicationReaction } from '../../reactions/decorators/application-reaction.decorator';
import { z } from 'zod';
import { EventDataSchema } from '../../events/ports/event.service';

@ApplicationReactionService('epitech')
export class EpitechApplicationReactionService {
  @ApplicationReaction('Open door')
  async openDoor(
    reactionParametersData: Record<string, unknown>,
    eventData: z.infer<typeof EventDataSchema>,
    reactionConnectionCredentials?: {
      api_key: string;
    },
  ): Promise<void> {
    if (!reactionConnectionCredentials) {
      return;
    }

    const { api_key } = reactionConnectionCredentials;
    const { door } = reactionParametersData;

    if (!door) {
      return;
    }

    const url = `https://tekme.eu/api/doors_open?token=${api_key}&door_name=${door}`;
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error('Epitech door open failed');
    }
  }
}
