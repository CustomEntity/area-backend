/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/

export const KAFKA_CONSUMER_METHOD_METADATA = 'KAFKA_CONSUMER_METHOD_METADATA';

export const Consumer = (topic: string): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    if (descriptor.value)
      Reflect.defineMetadata(
        KAFKA_CONSUMER_METHOD_METADATA,
        topic,
        descriptor.value,
      );
  };
};
