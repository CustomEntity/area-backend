/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { GetUserConnectionsResult } from '../queries/get-user-connections/get-user-connections.result';

export const USER_CONNECTION_QUERY_REPOSITORY = Symbol(
  'USER_CONNECTION_QUERY_REPOSITORY',
);

export interface UserConnectionQueryRepository {
  getUserConnections(userId: string): Promise<GetUserConnectionsResult>;
}
