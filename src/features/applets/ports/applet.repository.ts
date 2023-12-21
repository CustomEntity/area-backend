/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import {Applet} from "../entities/applet.entity";
import {Nullable} from "../../../shared/nullable";

export const APPLET_REPOSITORY = Symbol('APPLET_REPOSITORY');

export interface AppletRepository {
    findById(id: string): Promise<Nullable<Applet>>;

    findByUserId(userId: string): Promise<Applet[]>;

    findPollingApplets(): Promise<Applet[]>;

    findAll(): Promise<Applet[]>;
}