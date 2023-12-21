/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

export abstract class Entity<D> {
  protected readonly _data: D;

  constructor(data: D) {
    this._data = data;
  }

  get data(): D {
    return this._data;
  }
}
