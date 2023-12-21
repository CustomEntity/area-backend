/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

export abstract class Mapper<T> {
  abstract toEntity(data: any): T;

  abstract toPersistence(entity: T): any;
}
