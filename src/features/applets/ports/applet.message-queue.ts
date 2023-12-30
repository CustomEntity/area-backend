/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/

export const APPLET_MESSAGE_QUEUE_PROVIDER = Symbol('APPLET_MESSAGE_QUEUE_PROVIDER');

export interface AppletMessageQueue {
  publishAppletExecution(appletId: string): Promise<void>;

  bulkPublishAppletExecution(appletIds: string[]): Promise<void>;
}
