/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserConnectionCommand } from './create-user-connection.command';
import { UserConnectionRepository } from '../../ports/user-connection.repository';
import { DateProvider } from '../../../../system/date/date.provider';
import { IdProvider } from '../../../../system/id/id.provider';
import { UserConnection } from '../../entities/user-connection.entity';
import {
  ConnectionCredentials,
  ConnectionCredentialsSchema,
} from '../../value-objects/connection-credentials.vo';
import { EventDispatcher } from '../../../../system/event/event-dispatcher.provider';
import { UserConnectionCreatedEvent } from '../../events/user-connection-created.event';
import { z } from 'zod';
import { EncryptionProvider } from '../../../../system/encryption/encryption.provider';

@CommandHandler(CreateUserConnectionCommand)
export class CreateUserConnectionHandler
  implements ICommandHandler<CreateUserConnectionCommand>
{
  constructor(
    private readonly userConnectionRepository: UserConnectionRepository,
    private readonly dateProvider: DateProvider,
    private readonly idProvider: IdProvider,
    private readonly eventDispatcher: EventDispatcher,
    private readonly encryptionProvider: EncryptionProvider,
  ) {}

  encryptObjectFields(obj: Record<string, any>): Record<string, any> {
    const encryptedObject: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        encryptedObject[key] = this.encryptionProvider.encrypt(value);
      } else {
        encryptedObject[key] = value;
      }
    }

    return encryptedObject;
  }

  async execute(command: CreateUserConnectionCommand): Promise<void> {
    const id = this.idProvider.getId();
    const encryptedConnectionCredentials = this.encryptObjectFields(
      command.connectionCredentials,
    );
    const userConnection = new UserConnection({
      id,
      userId: command.userId,
      applicationId: command.applicationId,
      name: command.name,
      connectionCredentials: ConnectionCredentials.create(
        encryptedConnectionCredentials,
      ),
      createdAt: this.dateProvider.getDate(),
    });

    await this.userConnectionRepository.save(userConnection);

    await this.eventDispatcher.dispatch(
      new UserConnectionCreatedEvent(
        command.userId,
        id,
        command.applicationName,
        encryptedConnectionCredentials as z.infer<
          typeof ConnectionCredentialsSchema
        >,
      ),
    );
  }
}
