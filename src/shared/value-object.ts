/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

export abstract class ValueObject<Value> {
  protected readonly _value: Value;

  protected constructor(value: Value) {
    this._value = Object.freeze(value);
  }

  get value(): Value {
    return this._value;
  }

  public equals(vo?: ValueObject<Value>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo._value === undefined) {
      return false;
    }
    return this._value === vo._value;
  }
}
