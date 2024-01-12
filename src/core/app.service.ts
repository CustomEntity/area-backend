/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  APPLICATION_REPOSITORY,
  ApplicationRepository,
} from '../features/applications/core/ports/application.repository';
import {
  APPLICATION_EVENT_REPOSITORY,
  ApplicationEventRepository,
} from '../features/applications/events/ports/application-event.repository';
import {
  APPLICATION_REACTION_REPOSITORY,
  ApplicationReactionRepository,
} from '../features/applications/reactions/ports/application-reaction.repository';

// Don't care about this class, it's just for the area subject
@Injectable()
export class AppService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(APPLICATION_EVENT_REPOSITORY)
    private readonly applicationEventRepository: ApplicationEventRepository,
    @Inject(APPLICATION_REACTION_REPOSITORY)
    private readonly applicationReactionRepository: ApplicationReactionRepository,
  ) {}

  async getAboutJson(req: Request) {
    const applications = await this.applicationRepository.findAll();

    const applicationEvents: Record<string, any> = {};
    const applicationReactions: Record<string, any> = {};

    for (const application of applications) {
      const events = await this.applicationEventRepository.findByApplicationId(
        application.id,
      );
      applicationEvents[application.name] = events.map((event) => ({
        name: event.name,
        description: event.description,
      }));
    }

    for (const application of applications) {
      const reactions =
        await this.applicationReactionRepository.findByApplicationId(
          application.id,
        );
      applicationReactions[application.name] = reactions.map((reaction) => ({
        name: reaction.name,
        description: reaction.description,
      }));
    }

    return {
      client: {
        host: req.headers.host,
      },
      server: {
        current_time: Date.now(),
        services: [
          applications.map((application) => ({
            name: application.name,
            actions: applicationEvents[application.name],
            reactions: applicationReactions[application.name],
          })),
        ],
      },
    };
  }
}
