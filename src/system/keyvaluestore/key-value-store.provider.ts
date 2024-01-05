/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-05
 **/

export const KEY_VALUE_STORE_PROVIDER = Symbol('KEY_VALUE_STORE_PROVIDER');

export interface KeyValueStore {
  set(key: string, value: string, ttl?: number): Promise<void>;

  get(key: string): Promise<string | null>;

  delete(key: string): Promise<void>;

  exists(key: string): Promise<boolean>;
}
