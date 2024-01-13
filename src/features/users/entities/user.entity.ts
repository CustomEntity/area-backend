/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Entity } from '../../../shared/entity';
import { Email } from '../../../shared/value-objects/email.vo';

export type UserData = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: Email;
  isAdmin: boolean;
  hashedPassword?: string;
  profilePictureUrl?: string;
  createdAt: Date;
};

export class User extends Entity<UserData> {
  get id(): string {
    return this.data.id;
  }

  get firstName(): string | undefined {
    return this.data.firstName;
  }

  set firstName(firstName: string | undefined) {
    this.data.firstName = firstName;
  }

  get lastName(): string | undefined {
    return this.data.lastName;
  }

  set lastName(lastName: string | undefined) {
    this.data.lastName = lastName;
  }

  get email(): Email {
    return this.data.email;
  }

  get isAdmin(): boolean {
    return this.data.isAdmin;
  }

  get hashedPassword(): string | undefined {
    return this.data.hashedPassword;
  }

  get profilePictureUrl(): string | undefined {
    return this.data.profilePictureUrl;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }
}
