/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { AppletQueryRepository } from '../ports/applet.query-repository';
import { GetUserAppletsResult } from '../queries/get-user-applets/get-user-applets.result';
import { Nullable } from '../../../shared/nullable';
import { GetUserAppletResult } from '../queries/get-user-applet/get-user-applet.result';

const APPLET_TABLE = 'applets';
const EVENTS_TABLE = 'application_events';
const USER_CONNECTIONS_TABLE = 'user_connections';
const REACTIONS_TABLE = 'application_reactions';
const APPLICATIONS_TABLE = 'applications';
const USERS_TABLE = 'users';

@Injectable()
export class KnexAppletQueryRepository implements AppletQueryRepository {
  constructor(private readonly connection: Knex) {}

  async getUserApplets(userId: string): Promise<GetUserAppletsResult> {
    const results = await this.connection(USERS_TABLE)
      .leftJoin(
        APPLET_TABLE,
        `${USERS_TABLE}.id`,
        '=',
        `${APPLET_TABLE}.user_id`,
      )
      .select(
        `${APPLET_TABLE}.id`,
        `${APPLET_TABLE}.event_id`,
        `${APPLET_TABLE}.event_trigger_data`,
        `${APPLET_TABLE}.event_connection_id`,
        `${APPLET_TABLE}.reaction_id`,
        `${APPLET_TABLE}.reaction_parameters_data`,
        `${APPLET_TABLE}.reaction_connection_id`,
        `${APPLET_TABLE}.name`,
        `${APPLET_TABLE}.description`,
        `${APPLET_TABLE}.active`,
        `${APPLET_TABLE}.created_at`,
        `${USERS_TABLE}.id as user_id`,
      )
      .where('users.id', '=', userId);

    if (!results || results.length === 0 || results[0].user_id === null) {
      return {
        applets: undefined,
      };
    }

    const applets = results[0].id ? results : [];

    return {
      applets: applets.map((applet) => {
        return {
          id: applet.id,
          userId: applet.user_id,
          eventId: applet.event_id,
          eventTriggerData: applet.event_trigger_data,
          eventConnectionId: applet.event_connection_id,
          reactionId: applet.reaction_id,
          reactionParametersData: applet.reaction_parameters_data,
          reactionConnectionId: applet.reaction_connection_id,
          name: applet.name,
          description: applet.description,
          active: applet.active,
          createdAt: applet.created_at,
        };
      }),
    };
  }

  async getUserApplet(
    appletId: string,
  ): Promise<Nullable<GetUserAppletResult>> {
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
        eventConnectionCreatedAt: 'event_connection.created_at',

        reactionApplicationId: `${REACTIONS_TABLE}.application_id`,
        reactionName: `${REACTIONS_TABLE}.name`,
        reactionDescription: `${REACTIONS_TABLE}.description`,
        reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

        reactionConnectionUserId: 'reaction_connection.user_id',
        reactionConnectionApplicationId: 'reaction_connection.application_id',
        reactionConnectionApplicationName: 'reaction_application.name',
        reactionConnectionName: 'reaction_connection.name',
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
      )
      .where(`${APPLET_TABLE}.id`, appletId)
      .first();

    if (!applet) {
      return null;
    }

    return {
      applet: {
        id: applet.appletId,
        userId: applet.userId,
        event: {
          id: applet.eventId,
          applicationId: applet.eventApplicationId,
          name: applet.eventName,
          description: applet.eventDescription,
          notificationMethod: applet.eventNotificationMethod,
          notificationParameters: applet.eventNotificationParameters,
          triggerMapping: applet.eventTriggerMapping,
          createdAt: applet.eventCreatedAt,
        },
        eventTriggerData: applet.eventTriggerData,
        eventConnection: {
          id: applet.eventConnectionId,
          userId: applet.eventConnectionUserId,
          applicationId: applet.eventConnectionApplicationId,
          application: {
            id: applet.eventConnectionApplicationId,
            name: applet.eventConnectionApplicationName,
          },
          name: applet.eventConnectionName,
          createdAt: applet.eventConnectionCreatedAt,
        },
        reaction: {
          id: applet.reactionId,
          applicationId: applet.reactionApplicationId,
          name: applet.reactionName,
          description: applet.reactionDescription,
          createdAt: applet.reactionCreatedAt,
        },
        reactionParametersData: applet.reactionParametersData,
        reactionConnection: {
          id: applet.reactionConnectionId,
          userId: applet.reactionConnectionUserId,
          applicationId: applet.reactionConnectionApplicationId,
          application: {
            id: applet.reactionConnectionApplicationId,
            name: applet.reactionConnectionApplicationName,
          },
          name: applet.reactionConnectionName,
          createdAt: applet.reactionConnectionCreatedAt,
        },
        name: applet.appletName,
        description: applet.appletDescription,
        active: applet.appletActive,
        createdAt: applet.appletCreatedAt,
      },
    };
  }
}
