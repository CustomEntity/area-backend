/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  TriggerDataSchema,
} from '../events/ports/event.service';
import { z } from 'zod';
import { ApplicationEventService } from '../events/decorators/application-event-service.decorator';
import { ApplicationEvent } from '../events/decorators/application-event.decorator';
import { Octokit } from '@octokit/rest';
import {
  KEY_VALUE_STORE_PROVIDER,
  KeyValueStore,
} from '../../../system/keyvaluestore/key-value-store.provider';
import { Inject } from '@nestjs/common';

@ApplicationEventService('github')
export class GithubApplicationEventService {
  constructor(
    @Inject(KEY_VALUE_STORE_PROVIDER)
    private readonly keyValueStore: KeyValueStore,
  ) {}

  @ApplicationEvent('New commit')
  async checkIfNewCommitOccurred(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    let lastPolledAt = await this.keyValueStore.get(appletId);
    if (lastPolledAt === null) {
      lastPolledAt = new Date().toISOString();
      await this.keyValueStore.set(appletId, lastPolledAt, 60 * 60 * 24);
      return [];
    }
    const octokit = new Octokit({
      auth: eventConnectionCredentials.access_token,
    });

    const repositoryOwner = (eventTriggerData.repository as string).split(
      '/',
    )[0];
    const repositoryName = (eventTriggerData.repository as string).split(
      '/',
    )[1];

    try {
      const { data } = await octokit.repos.listCommits({
        owner: repositoryOwner,
        repo: repositoryName,
        since: lastPolledAt,
      });

      console.log(data);
    } catch (e) {
      console.error(e);
    }

    return [];
  }
}
