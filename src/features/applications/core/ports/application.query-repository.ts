/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { FindAllApplicationsResult } from '../queries/find-all-applications/find-all-applications.result';

export const APPLICATION_QUERY_REPOSITORY = Symbol(
  'APPLICATION_QUERY_REPOSITORY',
);

export interface ApplicationQueryRepository {
  findAll(): Promise<FindAllApplicationsResult>;
}
