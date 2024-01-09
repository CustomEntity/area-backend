/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { Injectable } from '@nestjs/common';
import { DetailedAppletRepository } from '../ports/detailed-applet.repository';
import { DetailedApplet } from '../entities/detailed-applet.entity';
import { Nullable } from '../../../shared/nullable';
import { Mapper } from '../../../shared/mapper';
import { Knex } from 'knex';
import { TriggerData } from '../value-objects/trigger-data.vo';
import { ReactionParametersData } from '../value-objects/reaction-parameters-data.vo';
import { Event } from '../value-objects/event.vo';
import { UserConnection } from '../value-objects/user-connection.vo';
import { Reaction } from '../value-objects/reaction.vo';

const APPLET_TABLE = 'applets';
const EVENTS_TABLE = 'application_events';
const USER_CONNECTIONS_TABLE = 'user_connections';
const REACTIONS_TABLE = 'application_reactions';
const APPLICATIONS_TABLE = 'applications';

@Injectable()
export class KnexDetailedAppletRepository implements DetailedAppletRepository {
  private readonly mapper: KnexDetailedAppletMapper =
    new KnexDetailedAppletMapper();

  constructor(private readonly connection: Knex) {}

  async findAll(): Promise<DetailedApplet[]> {
    const applets = await this.connection(APPLET_TABLE)
      .select({
        appletId: `${APPLET_TABLE}.id`,
        userId: `${APPLET_TABLE}.user_id`,
        eventId: `${APPLET_TABLE}.event_id`,
        eventTriggerData: `${APPLET_TABLE}.event_trigger_data`,
        eventConnectionId: `${APPLET_TABLE}.event_connection_id`,
        reactionId: `${APPLET_TABLE}.reaction_id`,
        reactionParameters: `${APPLET_TABLE}.reaction_parameters`,
        reactionConnectionId: `${APPLET_TABLE}.reaction_connection_id`,
        appletName: `${APPLET_TABLE}.name`,
        appletDescription: `${APPLET_TABLE}.description`,
        appletActive: `${APPLET_TABLE}.active`,
        appletCreatedAt: `${APPLET_TABLE}.created_at`,

        eventApplicationId: `${EVENTS_TABLE}.application_id`,
        eventName: `${EVENTS_TABLE}.name`,
        eventDescription: `${EVENTS_TABLE}.description`,
        eventNotificationMethod: `${EVENTS_TABLE}.notification_method`,
        eventNotificationParameters: `${EVENTS_TABLE}.notification_parameters`,
        eventTriggerMapping: `${EVENTS_TABLE}.trigger_mapping`,
        eventCreatedAt: `${EVENTS_TABLE}.created_at`,

        eventConnectionUserId: 'event_connection.user_id',
        eventConnectionApplicationId: 'event_connection.application_id',
        eventConnectionApplicationName: 'event_application.name',
        eventConnectionName: 'event_connection.name',
        eventConnectionCredentials: 'event_connection.connection_credentials',
        eventConnectionCreatedAt: 'event_connection.created_at',

        reactionApplicationId: `${REACTIONS_TABLE}.application_id`,
        reactionName: `${REACTIONS_TABLE}.name`,
        reactionDescription: `${REACTIONS_TABLE}.description`,
        reactionParametersMapping: `${REACTIONS_TABLE}.parameters_mapping`,
        reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

        reactionConnectionUserId: 'reaction_connection.user_id',
        reactionConnectionApplicationId: 'reaction_connection.application_id',
        reactionConnectionApplicationName: 'reaction_application.name',
        reactionConnectionName: 'reaction_connection.name',
        reactionConnectionCredentials:
          'reaction_connection.connection_credentials',
        reactionConnectionCreatedAt: 'reaction_connection.created_at',
      })
      .join(
        `${EVENTS_TABLE}`,
        `${EVENTS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.event_id`,
      )
      .join(
        `${USER_CONNECTIONS_TABLE} as event_connection`,
        'event_connection.id',
        '=',
        `${APPLET_TABLE}.event_connection_id`,
      )
      .join(
        `${APPLICATIONS_TABLE} as event_application`,
        'event_connection.application_id',
        '=',
        'event_application.id',
      )
      .join(
        `${USER_CONNECTIONS_TABLE} as reaction_connection`,
        'reaction_connection.id',
        '=',
        `${APPLET_TABLE}.reaction_connection_id`,
      )
      .join(
        `${REACTIONS_TABLE}`,
        `${REACTIONS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.reaction_id`,
      )
      .join(
        `${APPLICATIONS_TABLE} as reaction_application`,
        'reaction_connection.application_id',
        '=',
        'reaction_application.id',
      );

    return applets.map((applet) => this.mapper.toEntity(applet));
  }

  async findById(id: string): Promise<Nullable<DetailedApplet>> {
    const applet = await this.connection(APPLET_TABLE)
      .select({
        appletId: `${APPLET_TABLE}.id`,
        userId: `${APPLET_TABLE}.user_id`,
        eventId: `${APPLET_TABLE}.event_id`,
        eventTriggerData: `${APPLET_TABLE}.event_trigger_data`,
        eventConnectionId: `${APPLET_TABLE}.event_connection_id`,
        reactionId: `${APPLET_TABLE}.reaction_id`,
        reactionParametersData: `${APPLET_TABLE}.reaction_parameters_data`,
        reactionConnectionId: `${APPLET_TABLE}.reaction_connection_id`,
        appletName: `${APPLET_TABLE}.name`,
        appletDescription: `${APPLET_TABLE}.description`,
        appletActive: `${APPLET_TABLE}.active`,
        appletCreatedAt: `${APPLET_TABLE}.created_at`,

        eventApplicationId: `${EVENTS_TABLE}.application_id`,
        eventApplicationName: 'event_application.name',
        eventName: `${EVENTS_TABLE}.name`,
        eventDescription: `${EVENTS_TABLE}.description`,
        eventNotificationMethod: `${EVENTS_TABLE}.notification_method`,
        eventNotificationParameters: `${EVENTS_TABLE}.notification_parameters`,
        eventTriggerMapping: `${EVENTS_TABLE}.trigger_mapping`,
        eventCreatedAt: `${EVENTS_TABLE}.created_at`,

        eventConnectionUserId: 'event_connection.user_id',
        eventConnectionApplicationId: 'event_connection.application_id',
        eventConnectionName: 'event_connection.name',
        eventConnectionCredentials: 'event_connection.connection_credentials',
        eventConnectionCreatedAt: 'event_connection.created_at',

        reactionApplicationId: `${REACTIONS_TABLE}.application_id`,
        reactionApplicationName: 'reaction_application.name',
        reactionName: `${REACTIONS_TABLE}.name`,
        reactionDescription: `${REACTIONS_TABLE}.description`,
        reactionParametersMapping: `${REACTIONS_TABLE}.parameters_mapping`,
        reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

        reactionConnectionUserId: 'reaction_connection.user_id',
        reactionConnectionApplicationId: 'reaction_connection.application_id',
        reactionConnectionName: 'reaction_connection.name',
        reactionConnectionCredentials:
          'reaction_connection.connection_credentials',
        reactionConnectionCreatedAt: 'reaction_connection.created_at',
      })
      .join(
        `${EVENTS_TABLE}`,
        `${EVENTS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.event_id`,
      )
      .leftJoin(
        `${USER_CONNECTIONS_TABLE} as event_connection`,
        'event_connection.id',
        '=',
        `${APPLET_TABLE}.event_connection_id`,
      )
      .leftJoin(
        `${APPLICATIONS_TABLE} as event_application`,
        `${EVENTS_TABLE}.application_id`,
        '=',
        'event_application.id',
      )
      .leftJoin(
        `${USER_CONNECTIONS_TABLE} as reaction_connection`,
        'reaction_connection.id',
        '=',
        `${APPLET_TABLE}.reaction_connection_id`,
      )
      .join(
        `${REACTIONS_TABLE}`,
        `${REACTIONS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.reaction_id`,
      )
      .leftJoin(
        `${APPLICATIONS_TABLE} as reaction_application`,
        `${REACTIONS_TABLE}.application_id`,
        '=',
        'reaction_application.id',
      )
      .where(`${APPLET_TABLE}.id`, id)
      .first();

    if (!applet) {
      return null;
    }

    return this.mapper.toEntity(applet);
  }

  async findPollingApplets(): Promise<DetailedApplet[]> {
    const applets = await this.connection(APPLET_TABLE)
      .select({
        appletId: `${APPLET_TABLE}.id`,
        userId: `${APPLET_TABLE}.user_id`,
        eventId: `${APPLET_TABLE}.event_id`,
        eventTriggerData: `${APPLET_TABLE}.event_trigger_data`,
        eventConnectionId: `${APPLET_TABLE}.event_connection_id`,
        reactionId: `${APPLET_TABLE}.reaction_id`,
        reactionParametersData: `${APPLET_TABLE}.reaction_parameters_data`,
        reactionConnectionId: `${APPLET_TABLE}.reaction_connection_id`,
        appletName: `${APPLET_TABLE}.name`,
        appletDescription: `${APPLET_TABLE}.description`,
        appletActive: `${APPLET_TABLE}.active`,
        appletCreatedAt: `${APPLET_TABLE}.created_at`,

        eventApplicationId: `${EVENTS_TABLE}.application_id`,
        eventApplicationName: 'event_application.name',
        eventName: `${EVENTS_TABLE}.name`,
        eventDescription: `${EVENTS_TABLE}.description`,
        eventNotificationMethod: `${EVENTS_TABLE}.notification_method`,
        eventNotificationParameters: `${EVENTS_TABLE}.notification_parameters`,
        eventTriggerMapping: `${EVENTS_TABLE}.trigger_mapping`,
        eventCreatedAt: `${EVENTS_TABLE}.created_at`,

        eventConnectionUserId: 'event_connection.user_id',
        eventConnectionApplicationId: 'event_connection.application_id',
        eventConnectionName: 'event_connection.name',
        eventConnectionCredentials: 'event_connection.connection_credentials',
        eventConnectionCreatedAt: 'event_connection.created_at',

        reactionApplicationId: `${REACTIONS_TABLE}.application_id`,
        reactionApplicationName: 'reaction_application.name',
        reactionName: `${REACTIONS_TABLE}.name`,
        reactionDescription: `${REACTIONS_TABLE}.description`,
        reactionParametersMapping: `${REACTIONS_TABLE}.parameters_mapping`,
        reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

        reactionConnectionUserId: 'reaction_connection.user_id',
        reactionConnectionApplicationId: 'reaction_connection.application_id',
        reactionConnectionName: 'reaction_connection.name',
        reactionConnectionCredentials:
          'reaction_connection.connection_credentials',
        reactionConnectionCreatedAt: 'reaction_connection.created_at',
      })
      .join(
        `${EVENTS_TABLE}`,
        `${EVENTS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.event_id`,
      )
      .leftJoin(
        `${USER_CONNECTIONS_TABLE} as event_connection`,
        'event_connection.id',
        '=',
        `${APPLET_TABLE}.event_connection_id`,
      )
      .leftJoin(
        `${APPLICATIONS_TABLE} as event_application`,
        `${EVENTS_TABLE}.application_id`,
        '=',
        'event_application.id',
      )
      .leftJoin(
        `${USER_CONNECTIONS_TABLE} as reaction_connection`,
        'reaction_connection.id',
        '=',
        `${APPLET_TABLE}.reaction_connection_id`,
      )
      .join(
        `${REACTIONS_TABLE}`,
        `${REACTIONS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.reaction_id`,
      )
      .leftJoin(
        `${APPLICATIONS_TABLE} as reaction_application`,
        `${REACTIONS_TABLE}.application_id`,
        '=',
        'reaction_application.id',
      )
      .where(`${EVENTS_TABLE}.notification_method`, 'polling')
      .andWhere(`${APPLET_TABLE}.active`, true);

    return applets.map((applet) => this.mapper.toEntity(applet));
  }

  async findByUserConnectionId(
    userConnectionId: string,
  ): Promise<DetailedApplet[]> {
    const applets = await this.connection(APPLET_TABLE)
      .select({
        appletId: `${APPLET_TABLE}.id`,
        userId: `${APPLET_TABLE}.user_id`,
        eventId: `${APPLET_TABLE}.event_id`,
        eventTriggerData: `${APPLET_TABLE}.event_trigger_data`,
        eventConnectionId: `${APPLET_TABLE}.event_connection_id`,
        reactionId: `${APPLET_TABLE}.reaction_id`,
        reactionParametersData: `${APPLET_TABLE}.reaction_parameters_data`,
        reactionConnectionId: `${APPLET_TABLE}.reaction_connection_id`,
        appletName: `${APPLET_TABLE}.name`,
        appletDescription: `${APPLET_TABLE}.description`,
        appletActive: `${APPLET_TABLE}.active`,
        appletCreatedAt: `${APPLET_TABLE}.created_at`,

        eventApplicationId: `${EVENTS_TABLE}.application_id`,
        eventApplicationName: 'event_application.name',
        eventName: `${EVENTS_TABLE}.name`,
        eventDescription: `${EVENTS_TABLE}.description`,
        eventNotificationMethod: `${EVENTS_TABLE}.notification_method`,
        eventNotificationParameters: `${EVENTS_TABLE}.notification_parameters`,
        eventTriggerMapping: `${EVENTS_TABLE}.trigger_mapping`,
        eventCreatedAt: `${EVENTS_TABLE}.created_at`,

        eventConnectionUserId: 'event_connection.user_id',
        eventConnectionApplicationId: 'event_connection.application_id',
        eventConnectionName: 'event_connection.name',
        eventConnectionCredentials: 'event_connection.connection_credentials',
        eventConnectionCreatedAt: 'event_connection.created_at',

        reactionApplicationId: `${REACTIONS_TABLE}.application_id`,
        reactionApplicationName: 'reaction_application.name',
        reactionName: `${REACTIONS_TABLE}.name`,
        reactionDescription: `${REACTIONS_TABLE}.description`,
        reactionParametersMapping: `${REACTIONS_TABLE}.parameters_mapping`,
        reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

        reactionConnectionUserId: 'reaction_connection.user_id',
        reactionConnectionApplicationId: 'reaction_connection.application_id',
        reactionConnectionName: 'reaction_connection.name',
        reactionConnectionCredentials:
          'reaction_connection.connection_credentials',
        reactionConnectionCreatedAt: 'reaction_connection.created_at',
      })
      .join(
        `${EVENTS_TABLE}`,
        `${EVENTS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.event_id`,
      )
      .leftJoin(
        `${USER_CONNECTIONS_TABLE} as event_connection`,
        'event_connection.id',
        '=',
        `${APPLET_TABLE}.event_connection_id`,
      )
      .leftJoin(
        `${APPLICATIONS_TABLE} as event_application`,
        `${EVENTS_TABLE}.application_id`,
        '=',
        'event_application.id',
      )
      .leftJoin(
        `${USER_CONNECTIONS_TABLE} as reaction_connection`,
        'reaction_connection.id',
        '=',
        `${APPLET_TABLE}.reaction_connection_id`,
      )
      .join(
        `${REACTIONS_TABLE}`,
        `${REACTIONS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.reaction_id`,
      )
      .leftJoin(
        `${APPLICATIONS_TABLE} as reaction_application`,
        `${REACTIONS_TABLE}.application_id`,
        '=',
        'reaction_application.id',
      )
      .where(`${APPLET_TABLE}.event_connection_id`, userConnectionId)
      .orWhere(`${APPLET_TABLE}.reaction_connection_id`, userConnectionId);

    return applets.map((applet) => this.mapper.toEntity(applet));
  }
}

class KnexDetailedAppletMapper extends Mapper<DetailedApplet> {
  toEntity(data: any): DetailedApplet {
    const event = Event.create({
      id: data.eventId,
      application: {
        id: data.eventApplicationId,
        name: data.eventApplicationName,
      },
      name: data.eventName,
      description: data.eventDescription,
      notificationMethod: data.eventNotificationMethod,
      notificationParameters: data.eventNotificationParameters,
      triggerMapping: data.eventTriggerMapping,
      createdAt: new Date(data.eventCreatedAt),
    });

    let eventConnection = undefined;
    if (data.eventConnectionUserId) {
      eventConnection = UserConnection.create({
        id: data.eventConnectionId,
        userId: data.eventConnectionUserId,
        applicationId: data.eventConnectionApplicationId,
        name: data.eventConnectionName,
        connectionCredentials: data.eventConnectionCredentials,
        createdAt: new Date(data.eventConnectionCreatedAt),
      });
    }

    const reaction = Reaction.create({
      id: data.reactionId,
      application: {
        id: data.reactionApplicationId,
        name: data.reactionApplicationName,
      },
      name: data.reactionName,
      description: data.reactionDescription,
      parametersMapping: data.reactionParametersMapping,
      createdAt: new Date(data.reactionCreatedAt),
    });

    let reactionConnection = undefined;
    if (data.eventConnectionUserId) {
      reactionConnection = UserConnection.create({
        id: data.reactionConnectionId,
        userId: data.reactionConnectionUserId,
        applicationId: data.reactionConnectionApplicationId,
        name: data.reactionConnectionName,
        connectionCredentials: data.reactionConnectionCredentials,
        createdAt: new Date(data.reactionConnectionCreatedAt),
      });
    }

    const triggerData = TriggerData.create(data.eventTriggerData);

    const reactionParameters = ReactionParametersData.create(
      data.reactionParametersData,
    );

    return new DetailedApplet({
      id: data.appletId,
      userId: data.userId,
      event: event,
      eventTriggerData: triggerData,
      eventConnection: eventConnection,
      reaction: reaction,
      reactionParametersData: reactionParameters,
      reactionConnection: reactionConnection,
      name: data.appletName,
      description: data.appletDescription,
      active: data.appletActive,
      createdAt: new Date(data.appletCreatedAt),
    });
  }

  toPersistence(entity: DetailedApplet): any {
    return entity;
  }
}
