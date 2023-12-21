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

  get lastName(): string | undefined {
    return this.data.lastName;
  }

  get email(): Email {
    return this.data.email;
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
