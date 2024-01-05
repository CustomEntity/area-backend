/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-04
 **/

export const APPLICATION_REACTION_METADATA = Symbol(
  'APPLICATION_REACTION_METADATA',
);

export function ApplicationReaction(reactionName: string): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      APPLICATION_REACTION_METADATA,
      reactionName,
      target,
      propertyKey,
    );
  };
}
