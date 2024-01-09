/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import { ApplicationReactionService } from '../../reactions/decorators/application-reaction-service.decorator';
import { ApplicationReaction } from '../../reactions/decorators/application-reaction.decorator';
import { Octokit } from '@octokit/rest';
import { EventDataSchema } from '../../events/ports/event.service';
import { z } from 'zod';
import { interpolateString } from '../../utils/interpolation';

@ApplicationReactionService('github')
export class GithubApplicationReactionService {
  @ApplicationReaction('Create issue')
  async createIssue(
    reactionParametersData: Record<string, unknown>,
    eventData: z.infer<typeof EventDataSchema>,
    reactionConnectionCredentials?: {
      access_token: string;
      refresh_token: string;
    },
  ): Promise<void> {
    if (!reactionConnectionCredentials) {
      return;
    }
    const octokit = new Octokit({
      auth: reactionConnectionCredentials.access_token,
    });

    const repositoryOwner = (reactionParametersData.repository as string).split(
      '/',
    )[0];
    const repositoryName = (reactionParametersData.repository as string).split(
      '/',
    )[1];

    try {
      await octokit.issues.create({
        owner: repositoryOwner,
        repo: repositoryName,
        title: interpolateString(
          reactionParametersData.title as string,
          eventData as Record<string, string>,
        ),
        body: interpolateString(
          reactionParametersData.body as string,
          eventData as Record<string, string>,
        ),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
