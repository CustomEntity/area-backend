/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-04
 **/

export const APPLICATION_EVENT_METADATA = Symbol('APPLICATION_EVENT_METADATA');

export function ApplicationEvent(eventName: string): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      APPLICATION_EVENT_METADATA,
      eventName,
      target,
      propertyKey,
    );
  };
}
