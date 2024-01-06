/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import { ApplicationReactionService } from '../reactions/decorators/application-reaction-service.decorator';
import { ApplicationReaction } from '../reactions/decorators/application-reaction.decorator';
import { Octokit } from '@octokit/rest';

@ApplicationReactionService('github')
export class GithubApplicationReactionService {
  @ApplicationReaction('Create issue')
  async createIssue(
    reactionParametersData: Record<string, unknown>,
    reactionData: Record<string, unknown>,
    reactionConnectionCredentials: Record<string, unknown>,
  ): Promise<void> {
    console.log(
      'Create issue',
      reactionParametersData,
      reactionData,
      reactionConnectionCredentials,
    );
    const octokit = new Octokit({
      auth: reactionConnectionCredentials.access_token,
    });

    const repositoryOwner = (reactionParametersData.repository as string).split(
      '/',
    )[0];
    const repositoryName = (reactionParametersData.repository as string).split(
      '/',
    )[1];

    console.log('repositoryOwner', repositoryOwner);
    console.log('repositoryName', repositoryName);
    try {
      await octokit.issues.create({
        owner: repositoryOwner,
        repo: repositoryName,
        title: reactionParametersData.title as string,
        body: reactionParametersData.body as string,
      });
    } catch (e) {
      console.error(e);
    }
  }
}
