/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/

export const MESSAGE_QUEUE_PROVIDER = Symbol('MESSAGE_QUEUE_PROVIDER');

export interface AppletMessageQueue {
    publishAppletExecution(appletId: string): Promise<void>

    bulkPublishAppletExecution(appletIds: string[]): Promise<void>
}