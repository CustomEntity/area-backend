/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-02
 **/
import { GetApplicationEventsResult } from '../queries/get-application-events.result';

export const APPLICATION_EVENT_QUERY_REPOSITORY = Symbol(
  'APPLICATION_EVENT_QUERY_REPOSITORY',
);

export interface ApplicationEventQueryRepository {
  findEventsByApplicationId(
    applicationId: string,
  ): Promise<GetApplicationEventsResult>;
}
