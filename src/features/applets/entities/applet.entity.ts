/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import {TriggerData} from "../value-objects/trigger-data.vo";
import {ReactionAction} from "../value-objects/reaction-action.vo";
import {Entity} from "../../../shared/entity";
import {Event} from "../value-objects/event.vo";
import {UserConnection} from "../value-objects/user-connection.vo";
import {Reaction} from "../value-objects/reaction.vo";

export type AppletData = {
    id: string;
    userId: string;
    eventId: string;
    event: Event;
    eventTriggerData?: TriggerData;
    eventConnectionId: string;
    eventConnection: UserConnection;
    reactionId: string;
    reaction: Reaction;
    reactionAction?: ReactionAction;
    reactionConnectionId: string;
    reactionConnection: UserConnection;
    name: string;
    description: string;
    active: boolean;
    createdAt: Date;
}

export class Applet extends Entity<AppletData> {

    get id(): string {
        return this.data.id;
    }

    get userId(): string {
        return this.data.userId;
    }

    get eventId(): string {
        return this.data.eventId;
    }

    get event(): Event {
        return this.data.event;
    }

    get eventTriggerData(): TriggerData | undefined {
        return this.data.eventTriggerData;
    }

    get eventConnectionId(): string {
        return this.data.eventConnectionId;
    }

    get eventConnection(): UserConnection {
        return this.data.eventConnection;
    }

    get reactionId(): string {
        return this.data.reactionId;
    }

    get reaction(): Reaction {
        return this.data.reaction;
    }

    get reactionAction(): ReactionAction | undefined {
        return this.data.reactionAction;
    }

    get reactionConnectionId(): string {
        return this.data.reactionConnectionId;
    }

    get reactionConnection(): UserConnection {
        return this.data.reactionConnection;
    }

    get name(): string {
        return this.data.name;
    }

    get description(): string {
        return this.data.description;
    }

    get active(): boolean {
        return this.data.active;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }
}