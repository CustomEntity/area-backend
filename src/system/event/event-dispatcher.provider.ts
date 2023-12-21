/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

export const EVENT_DISPATCHER = Symbol('EVENT_DISPATCHER');

export interface Event {
    getName(): string;
}

export interface EventDispatcher {
    dispatch(event: Event): Promise<void>;
}