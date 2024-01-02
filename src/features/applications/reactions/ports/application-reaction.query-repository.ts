/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { GetApplicationReactionsResult } from '../queries/get-application-reactions.result';

export const APPLICATION_REACTION_QUERY_REPOSITORY = Symbol(
  'APPLICATION_REACTION_QUERY_REPOSITORY',
);

export interface ApplicationReactionQueryRepository {
  findReactionsByApplicationId(
    applicationId: string,
  ): Promise<GetApplicationReactionsResult>;
}
