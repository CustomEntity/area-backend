/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-12
 **/
import { Injectable } from '@nestjs/common';
import { EncryptionProvider } from './encryption.provider';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class Aes256EncryptionProvider implements EncryptionProvider {
  private readonly key: Buffer;
  private readonly encryptionIV: Buffer;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('encryptionSecretKey');
    if (!secretKey) {
      throw new Error('Encryption key is not defined');
    }
    const encryptionIV = this.configService.get<string>('encryptionSecretIV');
    if (!encryptionIV) {
      throw new Error('Encryption IV is not defined');
    }

    this.key = crypto.scryptSync(secretKey, 'salt', 32);
    this.encryptionIV = Buffer.from(encryptionIV, 'hex');
  }

  encrypt(data: string): string {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.key,
      this.encryptionIV,
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.key,
      this.encryptionIV,
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
