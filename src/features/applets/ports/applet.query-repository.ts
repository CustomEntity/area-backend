/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-31
 **/
import { GetUserAppletsResult } from '../queries/get-user-applets/get-user-applets.result';
import { Nullable } from '../../../shared/nullable';
import { GetUserAppletResult } from '../queries/get-user-applet/get-user-applet.result';

export const APPLET_QUERY_REPOSITORY = Symbol('APPLET_QUERY_REPOSITORY');

export interface AppletQueryRepository {
  getUserApplets(userId: string): Promise<GetUserAppletsResult>;

  getUserApplet(appletId: string): Promise<Nullable<GetUserAppletResult>>;
}
