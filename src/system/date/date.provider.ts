/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

export const DATE_PROVIDER = Symbol('DATE_PROVIDER');

export interface DateProvider {
  getDate(): Date;
}
