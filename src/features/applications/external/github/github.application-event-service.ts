/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import {
  EventDataSchema,
  TriggerDataSchema,
} from '../../events/ports/event.service';
import { z } from 'zod';
import { ApplicationEventService } from '../../events/decorators/application-event-service.decorator';
import { ApplicationEvent } from '../../events/decorators/application-event.decorator';
import { Octokit } from '@octokit/rest';
import {
  KEY_VALUE_STORE_PROVIDER,
  KeyValueStore,
} from '../../../../system/keyvaluestore/key-value-store.provider';
import { Inject } from '@nestjs/common';
import {
  EXECUTION_LOG_SERVICE,
  ExecutionLogService,
} from '../../../execution-logs/services/execution-log.service';

@ApplicationEventService('github')
export class GithubApplicationEventService {
  constructor(
    @Inject(KEY_VALUE_STORE_PROVIDER)
    private readonly keyValueStore: KeyValueStore,
    @Inject(EXECUTION_LOG_SERVICE)
    private readonly executionLogService: ExecutionLogService,
  ) {}

  @ApplicationEvent('New Collaborator')
  async checkIfNewCollaboratorOccurred(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    executionLogId: string,
    eventConnectionCredentials?: {
      access_token: string;
      refresh_token: string;
    },
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    if (!eventConnectionCredentials || !eventTriggerData) {
      return [];
    }

    await this.executionLogService.log(
      executionLogId,
      'INFO',
      'New Collaborator event triggered',
    );

    try {
      const octokit = new Octokit({
        auth: eventConnectionCredentials.access_token,
      });

      const repositoryOwner = (eventTriggerData.repository as string).split(
        '/',
      )[0];
      const repositoryName = (eventTriggerData.repository as string).split(
        '/',
      )[1];

      let lastPolledAt = await this.keyValueStore.get(appletId);
      if (lastPolledAt === null) {
        await this.executionLogService.log(
          executionLogId,
          'INFO',
          'No previous poll found, storing data for next poll',
        );
        lastPolledAt = new Date().toISOString();
        await this.keyValueStore.set(appletId, lastPolledAt, 60 * 60 * 24);
        const { data } = await octokit.repos.listCollaborators({
          owner: repositoryOwner,
          repo: repositoryName,
        });

        await this.keyValueStore.set(
          `${appletId}-lastCollaborators`,
          JSON.stringify(data.map((collaborator) => collaborator.id)),
          60 * 60 * 24,
        );
        return [];
      }

      await this.keyValueStore.set(
        appletId,
        new Date().toISOString(),
        60 * 60 * 24,
      );

      const { data } = await octokit.repos.listCollaborators({
        owner: repositoryOwner,
        repo: repositoryName,
      });

      const lastCollaborators = await this.keyValueStore.get(
        `${appletId}-lastCollaborators`,
      );

      if (lastCollaborators === null) {
        await this.keyValueStore.set(
          `${appletId}-lastCollaborators`,
          JSON.stringify(data.map((collaborator) => collaborator.id)),
          60 * 60 * 24,
        );
        return [];
      }

      const lastCollaboratorsData = JSON.parse(lastCollaborators) as number[];

      const newCollaborators = data.filter(
        (collaborator) => !lastCollaboratorsData.includes(collaborator.id),
      );

      await this.keyValueStore.set(
        `${appletId}-lastCollaborators`,
        JSON.stringify(data.map((collaborator) => collaborator.id)),
        60 * 60 * 24,
      );

      await this.executionLogService.log(
        executionLogId,
        'INFO',
        `${newCollaborators.length} new collaborators found`,
      );

      return newCollaborators.map((collaborator) => ({
        repository_owner: repositoryOwner,
        repository_name: repositoryName,
        collaborator_name: collaborator.name,
        collaborator_id: collaborator.id.toString(),
        collaborator_node_id: collaborator.node_id,
        collaborator_login: collaborator.login,
        collaborator_avatar_url: collaborator.avatar_url,
        collaborator_gravatar_id: collaborator.gravatar_id,
        collaborator_url: collaborator.url,
        collaborator_html_url: collaborator.html_url,
        collaborator_followers_url: collaborator.followers_url,
        collaborator_following_url: collaborator.following_url,
        collaborator_gists_url: collaborator.gists_url,
        collaborator_starred_url: collaborator.starred_url,
        collaborator_subscriptions_url: collaborator.subscriptions_url,
        collaborator_organizations_url: collaborator.organizations_url,
        collaborator_repos_url: collaborator.repos_url,
        collaborator_events_url: collaborator.events_url,
        collaborator_received_events_url: collaborator.received_events_url,
        collaborator_type: collaborator.type,
        collaborator_site_admin: collaborator.site_admin.toString(),
      }));
    } catch (e) {
      await this.executionLogService.log(
        executionLogId,
        'ERROR',
        'Error while fetching collaborators',
      );
    }

    return [];
  }

  @ApplicationEvent('New Commit Comment')
  async checkIfNewCommitCommentOccurred(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    executionLogId: string,
    eventConnectionCredentials?: {
      access_token: string;
      refresh_token: string;
    },
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    if (!eventConnectionCredentials || !eventTriggerData) {
      return [];
    }

    await this.executionLogService.log(
      executionLogId,
      'INFO',
      'New Commit Comment event triggered',
    );

    try {
      const octokit = new Octokit({
        auth: eventConnectionCredentials.access_token,
      });

      const repositoryOwner = (eventTriggerData.repository as string).split(
        '/',
      )[0];
      const repositoryName = (eventTriggerData.repository as string).split(
        '/',
      )[1];

      let lastPolledAt = await this.keyValueStore.get(appletId);
      if (lastPolledAt === null) {
        await this.executionLogService.log(
          executionLogId,
          'INFO',
          'No previous poll found, storing data for next poll',
        );

        lastPolledAt = new Date().toISOString();
        await this.keyValueStore.set(appletId, lastPolledAt, 60 * 60 * 24);
        const { data } = await octokit.repos.listCommitCommentsForRepo({
          owner: repositoryOwner,
          repo: repositoryName,
        });

        await this.keyValueStore.set(
          `${appletId}-lastCommitComments`,
          JSON.stringify(data.map((commitComment) => commitComment.id)),
          60 * 60 * 24,
        );
        return [];
      }

      await this.keyValueStore.set(
        appletId,
        new Date().toISOString(),
        60 * 60 * 24,
      );

      const { data } = await octokit.repos.listCommitCommentsForRepo({
        owner: repositoryOwner,
        repo: repositoryName,
      });

      const lastCommitComments = await this.keyValueStore.get(
        `${appletId}-lastCommitComments`,
      );

      if (lastCommitComments === null) {
        await this.keyValueStore.set(
          `${appletId}-lastCommitComments`,
          JSON.stringify(data.map((commitComment) => commitComment.id)),
          60 * 60 * 24,
        );
        return [];
      }

      const lastCommitCommentsData = JSON.parse(lastCommitComments) as number[];

      const newCommitComments = data.filter(
        (commitComment) => !lastCommitCommentsData.includes(commitComment.id),
      );

      await this.executionLogService.log(
        executionLogId,
        'INFO',
        `${newCommitComments.length} new commit comments found`,
      );

      await this.keyValueStore.set(
        `${appletId}-lastCommitComments`,
        JSON.stringify(data.map((commitComment) => commitComment.id)),
        60 * 60 * 24,
      );

      return newCommitComments.map((commitComment) => ({
        repository_owner: repositoryOwner,
        repository_name: repositoryName,
        commit_comment_id: commitComment.id.toString(),
        commit_comment_node_id: commitComment.node_id,
        commit_comment_body: commitComment.body,
        commit_comment_path: commitComment.path,
        commit_comment_position: commitComment.position?.toString(),
        commit_comment_line: commitComment.line?.toString(),
        commit_comment_commit_id: commitComment.commit_id,
        commit_comment_created_at: commitComment.created_at,
      }));
    } catch (e) {}

    return [];
  }

  @ApplicationEvent('New Pull Request')
  async checkIfNewPullRequestOccurred(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    executionLogId: string,
    eventConnectionCredentials?: {
      access_token: string;
      refresh_token: string;
    },
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    if (!eventConnectionCredentials || !eventTriggerData) {
      return [];
    }

    await this.executionLogService.log(
      executionLogId,
      'INFO',
      'New Pull Request event triggered',
    );

    try {
      const octokit = new Octokit({
        auth: eventConnectionCredentials.access_token,
      });

      const repositoryOwner = (eventTriggerData.repository as string).split(
        '/',
      )[0];
      const repositoryName = (eventTriggerData.repository as string).split(
        '/',
      )[1];

      let lastPolledAt = await this.keyValueStore.get(appletId);
      if (lastPolledAt === null) {
        await this.executionLogService.log(
          executionLogId,
          'INFO',
          'No previous poll found, storing data for next poll',
        );
        lastPolledAt = new Date().toISOString();
        await this.keyValueStore.set(appletId, lastPolledAt, 60 * 60 * 24);
        const { data } = await octokit.pulls.list({
          owner: repositoryOwner,
          repo: repositoryName,
        });

        await this.keyValueStore.set(
          `${appletId}-lastPullRequests`,
          JSON.stringify(data.map((pullRequest) => pullRequest.number)),
          60 * 60 * 24,
        );
        return [];
      }

      await this.keyValueStore.set(
        appletId,
        new Date().toISOString(),
        60 * 60 * 24,
      );

      const { data } = await octokit.pulls.list({
        owner: repositoryOwner,
        repo: repositoryName,
      });

      const lastPullRequests = await this.keyValueStore.get(
        `${appletId}-lastPullRequests`,
      );

      if (lastPullRequests === null) {
        await this.keyValueStore.set(
          `${appletId}-lastPullRequests`,
          JSON.stringify(data.map((pullRequest) => pullRequest.number)),
          60 * 60 * 24,
        );
        return [];
      }

      const lastPullRequestsData = JSON.parse(lastPullRequests) as number[];

      const newPullRequests = data.filter(
        (pullRequest) => !lastPullRequestsData.includes(pullRequest.number),
      );

      await this.keyValueStore.set(
        `${appletId}-lastPullRequests`,
        JSON.stringify(data.map((pullRequest) => pullRequest.number)),
        60 * 60 * 24,
      );

      await this.executionLogService.log(
        executionLogId,
        'INFO',
        `${newPullRequests.length} new pull requests found`,
      );

      return newPullRequests.map((pullRequest) => ({
        repository_owner: repositoryOwner,
        repository_name: repositoryName,
        pull_request_id: pullRequest.id.toString(),
        pull_request_node_id: pullRequest.node_id,
        pull_request_number: pullRequest.number.toString(),
        pull_request_state: pullRequest.state,
        pull_request_locked: pullRequest.locked.toString(),
        pull_request_title: pullRequest.title,
        pull_request_body: pullRequest.body,
        pull_request_created_at: pullRequest.created_at,
        pull_request_updated_at: pullRequest.updated_at,
      }));
    } catch (e) {
      await this.executionLogService.log(
        executionLogId,
        'ERROR',
        'Error while fetching pull requests',
      );
    }

    return [];
  }

  @ApplicationEvent('New Branch')
  async checkIfNewBranchOccurred(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    executionLogId: string,
    eventConnectionCredentials?: {
      access_token: string;
      refresh_token: string;
    },
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    if (!eventConnectionCredentials || !eventTriggerData) {
      return [];
    }

    await this.executionLogService.log(
      executionLogId,
      'INFO',
      'New Branch event triggered',
    );

    try {
      const octokit = new Octokit({
        auth: eventConnectionCredentials.access_token,
      });

      const repositoryOwner = (eventTriggerData.repository as string).split(
        '/',
      )[0];
      const repositoryName = (eventTriggerData.repository as string).split(
        '/',
      )[1];

      let lastPolledAt = await this.keyValueStore.get(appletId);
      if (lastPolledAt === null) {
        await this.executionLogService.log(
          executionLogId,
          'INFO',
          'No previous poll found, storing data for next poll',
        );
        lastPolledAt = new Date().toISOString();
        await this.keyValueStore.set(appletId, lastPolledAt, 60 * 60 * 24);
        const { data } = await octokit.repos.listBranches({
          owner: repositoryOwner,
          repo: repositoryName,
        });

        await this.keyValueStore.set(
          `${appletId}-lastBranches`,
          JSON.stringify(data.map((branch) => branch.name)),
          60 * 60 * 24,
        );
        return [];
      }

      await this.keyValueStore.set(
        appletId,
        new Date().toISOString(),
        60 * 60 * 24,
      );

      const { data } = await octokit.repos.listBranches({
        owner: repositoryOwner,
        repo: repositoryName,
      });

      const lastBranches = await this.keyValueStore.get(
        `${appletId}-lastBranches`,
      );

      if (lastBranches === null) {
        await this.keyValueStore.set(
          `${appletId}-lastBranches`,
          JSON.stringify(data.map((branch) => branch.name)),
          60 * 60 * 24,
        );
        return [];
      }

      const lastBranchesData = JSON.parse(lastBranches) as string[];

      const branches = data.map((branch) => branch.name);

      const newBranches = branches.filter(
        (branch) => !lastBranchesData.includes(branch),
      );

      await this.executionLogService.log(
        executionLogId,
        'INFO',
        `${newBranches.length} new branches found`,
      );

      await this.keyValueStore.set(
        `${appletId}-lastBranches`,
        JSON.stringify(branches),
        60 * 60 * 24,
      );

      return newBranches.map((branch) => ({
        repository_owner: repositoryOwner,
        repository_name: repositoryName,
        branch: branch,
      }));
    } catch (e) {
      await this.executionLogService.log(
        executionLogId,
        'ERROR',
        'Error while fetching branches',
      );
    }

    return [];
  }

  @ApplicationEvent('New Commit')
  async checkIfNewCommitOccurred(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    executionLogId: string,
    eventConnectionCredentials?: {
      access_token: string;
      refresh_token: string;
    },
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    if (!eventConnectionCredentials || !eventTriggerData) {
      return [];
    }
    await this.executionLogService.log(
      executionLogId,
      'INFO',
      'New Commit event triggered',
    );

    let lastPolledAt = await this.keyValueStore.get(appletId);
    if (lastPolledAt === null) {
      await this.executionLogService.log(
        executionLogId,
        'INFO',
        'No previous poll found, storing data for next poll',
      );
      lastPolledAt = new Date().toISOString();
      await this.keyValueStore.set(appletId, lastPolledAt, 60 * 60 * 24);

      return [];
    }

    await this.keyValueStore.set(
      appletId,
      new Date().toISOString(),
      60 * 60 * 24,
    );

    try {
      const octokit = new Octokit({
        auth: eventConnectionCredentials.access_token,
      });

      const repositoryOwner = (eventTriggerData.repository as string).split(
        '/',
      )[0];
      const repositoryName = (eventTriggerData.repository as string).split(
        '/',
      )[1];

      const listCommitsParams = {
        owner: repositoryOwner,
        repo: repositoryName,
        since: lastPolledAt,
      } as any;

      if (eventTriggerData.branch) {
        listCommitsParams.sha = eventTriggerData.branch;
      }
      const { data } = await octokit.repos.listCommits(listCommitsParams);

      await this.executionLogService.log(
        executionLogId,
        'INFO',
        `${data.length} new commits found`,
      );
      return data.map((commit) => ({
        repository_owner: repositoryOwner,
        repository_name: repositoryName,
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
      await this.executionLogService.log(
        executionLogId,
        'ERROR',
        'Error while fetching commits',
      );
    }

    return [];
  }
}
