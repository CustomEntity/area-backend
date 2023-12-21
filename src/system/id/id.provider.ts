/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

export const ID_PROVIDER = Symbol('ID_PROVIDER');

export interface IdProvider {
  getId(): string;
}
