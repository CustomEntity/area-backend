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

      await this.keyValueStore.set(
        appletId,
        new Date().toISOString(),
        60 * 60 * 24,
      );

      return data.map((commit) => ({
        sha: commit.sha,
        commit_message: commit.commit.message,
        commit_author: commit.commit.author?.name,
        commit_author_email: commit.commit.author?.email,
        commit_author_date: commit.commit.author?.date,
        commit_committer: commit.commit.committer?.name,
        commit_committer_email: commit.commit.committer?.email,
        commit_committer_date: commit.commit.committer?.date,
        commit_tree_sha: commit.commit.tree.sha,
        commit_url: commit.commit.url,
        commit_comment_count: commit.commit.comment_count.toString(),
        commit_verification_verified:
          commit.commit.verification?.verified.toString(),
        commit_verification_reason: commit.commit.verification?.reason,
        commit_verification_signature: commit.commit.verification?.signature,
        commit_verification_payload: commit.commit.verification?.payload,
        author_login: commit.author?.login,
        author_id: commit.author?.id.toString(),
        author_node_id: commit.author?.node_id,
        author_avatar_url: commit.author?.avatar_url,
        author_gravatar_id: commit.author?.gravatar_id,
        author_url: commit.author?.url,
        author_html_url: commit.author?.html_url,
        author_followers_url: commit.author?.followers_url,
        author_following_url: commit.author?.following_url,
        author_gists_url: commit.author?.gists_url,
        author_starred_url: commit.author?.starred_url,
        author_subscriptions_url: commit.author?.subscriptions_url,
        author_organizations_url: commit.author?.organizations_url,
        author_repos_url: commit.author?.repos_url,
        author_events_url: commit.author?.events_url,
        author_received_events_url: commit.author?.received_events_url,
        author_type: commit.author?.type,
        author_site_admin: commit.author?.site_admin.toString(),
        committer_login: commit.committer?.login,
        committer_id: commit.committer?.id.toString(),
        committer_node_id: commit.committer?.node_id,
        committer_avatar_url: commit.committer?.avatar_url,
      }));
    } catch (e) {
      console.error(e);
    }

    return [];
  }
}
