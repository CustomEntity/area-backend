/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

export const HASH_PROVIDER = Symbol('HASH_PROVIDER');

export interface HashProvider {
  hash(data: string): Promise<string>;

  verify(data: string, hash: string): Promise<boolean>;
}
