/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import {Injectable} from "@nestjs/common";
import {AppletRepository} from "../ports/applet.repository";
import {Applet} from "../entities/applet.entity";
import {Nullable} from "../../../shared/nullable";
import {Mapper} from "../../../shared/mapper";
import {Knex} from "knex";
import {TriggerData} from "../value-objects/trigger-data.vo";
import {ReactionAction} from "../value-objects/reaction-action.vo";
import {Event} from "../value-objects/event.vo"
import {UserConnection} from "../value-objects/user-connection.vo";
import {Reaction} from "../value-objects/reaction.vo";

const APPLET_TABLE = 'applets';
const EVENTS_TABLE = 'application_events';
const USER_CONNECTIONS_TABLE = 'user_connections';
const REACTIONS_TABLE = 'application_reactions';
const APPLICATIONS_TABLE = 'applications';

@Injectable()
export class KnexAppletRepository implements AppletRepository {

    private readonly mapper: KnexAppletMapper = new KnexAppletMapper();

    constructor(
        private readonly connection: Knex
    ) {
    }

    async findAll(): Promise<Applet[]> {
        const applets = await this.connection(APPLET_TABLE).select({
                appletId: `${APPLET_TABLE}.id`,
                userId: `${APPLET_TABLE}.user_id`,
                eventId: `${APPLET_TABLE}.event_id`,
                eventTriggerData: `${APPLET_TABLE}.event_trigger_data`,
                eventConnectionId: `${APPLET_TABLE}.event_connection_id`,
                reactionId: `${APPLET_TABLE}.reaction_id`,
                reactionAction: `${APPLET_TABLE}.reaction_action`,
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
                reactionParameters: `${REACTIONS_TABLE}.parameters`,
                reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

                reactionConnectionUserId: 'reaction_connection.user_id',
                reactionConnectionApplicationId: 'reaction_connection.application_id',
                reactionConnectionApplicationName: 'reaction_application.name',
                reactionConnectionName: 'reaction_connection.name',
                reactionConnectionCredentials: 'reaction_connection.connection_credentials',
                reactionConnectionCreatedAt: 'reaction_connection.created_at',
            })
            .join(`${EVENTS_TABLE}`, `${EVENTS_TABLE}.id`, '=', `${APPLET_TABLE}.event_id`)
            .join(`${USER_CONNECTIONS_TABLE} as event_connection`, 'event_connection.id', '=', `${APPLET_TABLE}.event_connection_id`)
            .join(`${APPLICATIONS_TABLE} as event_application`, 'event_connection.application_id', '=', 'event_application.id')
            .join(`${USER_CONNECTIONS_TABLE} as reaction_connection`, 'reaction_connection.id', '=', `${APPLET_TABLE}.reaction_connection_id`)
            .join(`${REACTIONS_TABLE}`, `${REACTIONS_TABLE}.id`, '=', `${APPLET_TABLE}.reaction_id`)
            .join(`${APPLICATIONS_TABLE} as reaction_application`, 'reaction_connection.application_id', '=', 'reaction_application.id');

        return applets.map((applet) => this.mapper.toEntity(applet));
    }

    async findById(id: string): Promise<Nullable<Applet>> {
        const applet = await this.connection(APPLET_TABLE)
            .select({
                appletId: `${APPLET_TABLE}.id`,
                userId: `${APPLET_TABLE}.user_id`,
                eventId: `${APPLET_TABLE}.event_id`,
                eventTriggerData: `${APPLET_TABLE}.event_trigger_data`,
                eventConnectionId: `${APPLET_TABLE}.event_connection_id`,
                reactionId: `${APPLET_TABLE}.reaction_id`,
                reactionAction: `${APPLET_TABLE}.reaction_action`,
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
                reactionParameters: `${REACTIONS_TABLE}.parameters`,
                reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

                reactionConnectionUserId: 'reaction_connection.user_id',
                reactionConnectionApplicationId: 'reaction_connection.application_id',
                reactionConnectionApplicationName: 'reaction_application.name',
                reactionConnectionName: 'reaction_connection.name',
                reactionConnectionCredentials: 'reaction_connection.connection_credentials',
                reactionConnectionCreatedAt: 'reaction_connection.created_at',
            })
            .join(`${EVENTS_TABLE}`, `${EVENTS_TABLE}.id`, '=', `${APPLET_TABLE}.event_id`)
            .join(`${USER_CONNECTIONS_TABLE} as event_connection`, 'event_connection.id', '=', `${APPLET_TABLE}.event_connection_id`)
            .join(`${APPLICATIONS_TABLE} as event_application`, 'event_connection.application_id', '=', 'event_application.id')
            .join(`${USER_CONNECTIONS_TABLE} as reaction_connection`, 'reaction_connection.id', '=', `${APPLET_TABLE}.reaction_connection_id`)
            .join(`${REACTIONS_TABLE}`, `${REACTIONS_TABLE}.id`, '=', `${APPLET_TABLE}.reaction_id`)
            .join(`${APPLICATIONS_TABLE} as reaction_application`, 'reaction_connection.application_id', '=', 'reaction_application.id')
            .where(`${APPLET_TABLE}.id`, id)
            .first();

        if (!applet) {
            return null;
        }

        return this.mapper.toEntity(applet);
    }

    async findByUserId(userId: string): Promise<Applet[]> {
        const applets = await this.connection(APPLET_TABLE)
            .select({
                appletId: `${APPLET_TABLE}.id`,
                userId: `${APPLET_TABLE}.user_id`,
                eventId: `${APPLET_TABLE}.event_id`,
                eventTriggerData: `${APPLET_TABLE}.event_trigger_data`,
                eventConnectionId: `${APPLET_TABLE}.event_connection_id`,
                reactionId: `${APPLET_TABLE}.reaction_id`,
                reactionAction: `${APPLET_TABLE}.reaction_action`,
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
                reactionParameters: `${REACTIONS_TABLE}.parameters`,
                reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

                reactionConnectionUserId: 'reaction_connection.user_id',
                reactionConnectionApplicationId: 'reaction_connection.application_id',
                reactionConnectionApplicationName: 'reaction_application.name',
                reactionConnectionName: 'reaction_connection.name',
                reactionConnectionCredentials: 'reaction_connection.connection_credentials',
                reactionConnectionCreatedAt: 'reaction_connection.created_at',
            })
            .join(`${EVENTS_TABLE}`, `${EVENTS_TABLE}.id`, '=', `${APPLET_TABLE}.event_id`)
            .join(`${USER_CONNECTIONS_TABLE} as event_connection`, 'event_connection.id', '=', `${APPLET_TABLE}.event_connection_id`)
            .join(`${APPLICATIONS_TABLE} as event_application`, 'event_connection.application_id', '=', 'event_application.id')
            .join(`${USER_CONNECTIONS_TABLE} as reaction_connection`, 'reaction_connection.id', '=', `${APPLET_TABLE}.reaction_connection_id`)
            .join(`${REACTIONS_TABLE}`, `${REACTIONS_TABLE}.id`, '=', `${APPLET_TABLE}.reaction_id`)
            .join(`${APPLICATIONS_TABLE} as reaction_application`, 'reaction_connection.application_id', '=', 'reaction_application.id')
            .where(`${APPLET_TABLE}.user_id`, userId);

        return applets.map((applet) => this.mapper.toEntity(applet));
    }

    async findPollingApplets(): Promise<Applet[]> {
        const applets = await this.connection(APPLET_TABLE)
            .select({
                appletId: `${APPLET_TABLE}.id`,
                userId: `${APPLET_TABLE}.user_id`,
                eventId: `${APPLET_TABLE}.event_id`,
                eventTriggerData: `${APPLET_TABLE}.event_trigger_data`,
                eventConnectionId: `${APPLET_TABLE}.event_connection_id`,
                reactionId: `${APPLET_TABLE}.reaction_id`,
                reactionAction: `${APPLET_TABLE}.reaction_action`,
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
                reactionParameters: `${REACTIONS_TABLE}.parameters`,
                reactionCreatedAt: `${REACTIONS_TABLE}.created_at`,

                reactionConnectionUserId: 'reaction_connection.user_id',
                reactionConnectionApplicationId: 'reaction_connection.application_id',
                reactionConnectionApplicationName: 'reaction_application.name',
                reactionConnectionName: 'reaction_connection.name',
                reactionConnectionCredentials: 'reaction_connection.connection_credentials',
                reactionConnectionCreatedAt: 'reaction_connection.created_at',
            })
            .join(`${EVENTS_TABLE}`, `${EVENTS_TABLE}.id`, '=', `${APPLET_TABLE}.event_id`)
            .join(`${USER_CONNECTIONS_TABLE} as event_connection`, 'event_connection.id', '=', `${APPLET_TABLE}.event_connection_id`)
            .join(`${APPLICATIONS_TABLE} as event_application`, 'event_connection.application_id', '=', 'event_application.id')
            .join(`${USER_CONNECTIONS_TABLE} as reaction_connection`, 'reaction_connection.id', '=', `${APPLET_TABLE}.reaction_connection_id`)
            .join(`${REACTIONS_TABLE}`, `${REACTIONS_TABLE}.id`, '=', `${APPLET_TABLE}.reaction_id`)
            .join(`${APPLICATIONS_TABLE} as reaction_application`, 'reaction_connection.application_id', '=', 'reaction_application.id')
            .where(`${EVENTS_TABLE}.notification_method`, 'polling')
            .andWhere(`${APPLET_TABLE}.active`, true);

        return applets.map((applet) => this.mapper.toEntity(applet));
    }

}

class KnexAppletMapper extends Mapper<Applet> {
    toEntity(data: any): Applet {
        const event = Event.create({
            id: data.eventId,
            applicationId: data.eventApplicationId,
            name: data.eventName,
            description: data.eventDescription,
            notificationMethod: data.eventNotificationMethod,
            notificationParameters: data.eventNotificationParameters,
            triggerMapping: data.eventTriggerMapping,
            createdAt: new Date(data.eventCreatedAt)
        });

        const eventConnection = UserConnection.create({
            id: data.eventConnectionId,
            userId: data.eventConnectionUserId,
            applicationId: data.eventConnectionApplicationId,
            application: {
                id: data.eventConnectionApplicationId,
                name: data.eventConnectionApplicationName
            },
            name: data.eventConnectionName,
            connectionCredentials: data.eventConnectionCredentials,
            createdAt: new Date(data.eventConnectionCreatedAt)
        });

        const reaction = Reaction.create({
            id: data.reactionId,
            applicationId: data.reactionApplicationId,
            name: data.reactionName,
            description: data.reactionDescription,
            parameters: data.reactionParameters,
            createdAt: new Date(data.reactionCreatedAt)
        });

        const reactionConnection = UserConnection.create({
            id: data.reactionConnectionId,
            userId: data.reactionConnectionUserId,
            applicationId: data.reactionConnectionApplicationId,
            application: {
                id: data.reactionConnectionApplicationId,
                name: data.reactionConnectionApplicationName
            },
            name: data.reactionConnectionName,
            connectionCredentials: data.reactionConnectionCredentials,
            createdAt: new Date(data.reactionConnectionCreatedAt)
        });

        const triggerData = TriggerData.create(data.eventTriggerData);
        const reactionAction = ReactionAction.create(data.reactionAction);

        return new Applet({
            id: data.appletId,
            userId: data.userId,
            eventId: data.eventId,
            event: event,
            eventTriggerData: triggerData,
            eventConnectionId: data.eventConnectionId,
            eventConnection: eventConnection,
            reactionId: data.reactionId,
            reaction: reaction,
            reactionAction: reactionAction,
            reactionConnectionId: data.reactionConnectionId,
            reactionConnection: reactionConnection,
            name: data.appletName,
            description: data.appletDescription,
            active: data.appletActive,
            createdAt: new Date(data.appletCreatedAt)
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
            reaction_action: entity.reactionAction?.value,
            reaction_connection_id: entity.reactionConnectionId,
            name: entity.name,
            description: entity.description,
            active: entity.active,
            created_at: entity.createdAt,
        };
    }

}