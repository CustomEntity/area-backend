/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-12
 **/

export const ENCRYPTION_PROVIDER = Symbol('ENCRYPTION_PROVIDER');

export interface EncryptionProvider {
  encrypt(data: string): string;

  decrypt(data: string): string;
}
