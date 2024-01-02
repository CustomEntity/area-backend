/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { Applet } from '../entities/applet.entity';
import { Mapper } from '../../../shared/mapper';
import { AppletRepository } from '../ports/applet.repository';
import { Injectable } from '@nestjs/common';
import { Nullable } from '../../../shared/nullable';
import { Knex } from 'knex';
import { TriggerData } from '../value-objects/trigger-data.vo';
import { ReactionParametersData } from '../value-objects/reaction-parameters-data.vo';
import * as console from 'console';
import { undefined } from 'zod';

const APPLET_TABLE = 'applets';

@Injectable()
export class KnexAppletRepository implements AppletRepository {
  private readonly mapper: KnexAppletMapper = new KnexAppletMapper();

  constructor(private readonly connection: Knex) {}

  async findAll(): Promise<Applet[]> {
    const rows = await this.connection<Applet>(APPLET_TABLE).select();
    return rows.map((row) => this.mapper.toEntity(row));
  }

  async findById(id: string): Promise<Nullable<Applet>> {
    const row = await this.connection<Applet>(APPLET_TABLE)
      .select()
      .where('id', id)
      .first();

    if (!row) {
      return null;
    }
    return this.mapper.toEntity(row);
  }

  async findByUserConnectionId(userConnectionId: string): Promise<Applet[]> {
    const rows = await this.connection<Applet>(APPLET_TABLE)
      .select()
      .where('user_connection_id', userConnectionId);
    return rows.map((row) => this.mapper.toEntity(row));
  }

  async findByUserId(userId: string): Promise<Applet[]> {
    const rows = await this.connection<Applet>(APPLET_TABLE)
      .select()
      .where('user_id', userId);
    return rows.map((row) => this.mapper.toEntity(row));
  }

  async save(applet: Applet): Promise<void> {
    await this.connection(APPLET_TABLE)
      .insert(this.mapper.toPersistence(applet))
      .onConflict('id')
      .merge();
  }

  delete(applet: Applet): Promise<void> {
    return this.connection(APPLET_TABLE).where('id', applet.id).del();
  }
}

class KnexAppletMapper extends Mapper<Applet> {
  toEntity(data: any): Applet {
    return new Applet({
      id: data.id,
      userId: data.user_id,
      eventId: data.event_id,
      eventTriggerData: TriggerData.create(data.event_trigger_data),
      eventConnectionId: data.event_connection_id,
      reactionId: data.reaction_id,
      reactionActionData: ReactionParametersData.create(
        data.reaction_action_data,
      ),
      reactionConnectionId: data.reaction_connection_id,
      name: data.name,
      description: data.description,
      active: data.active,
      createdAt: data.created_at,
    });
  }

  toPersistence(entity: Applet): any {
    return {
      id: entity.id,
      user_id: entity.userId,
      event_id: entity.eventId,
      event_trigger_data: entity.eventTriggerData?.value,
      event_connection_id: entity.eventConnectionId,
      reaction_id: entity.reactionId,
      reaction_action_data: entity.reactionActionData?.value,
      reaction_connection_id: entity.reactionConnectionId,
      name: entity.name,
      description: entity.description,
      active: entity.active,
      created_at: entity.createdAt,
    };
  }
}
