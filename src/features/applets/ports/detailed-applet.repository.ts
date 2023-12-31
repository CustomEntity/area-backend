/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { DetailedApplet } from '../entities/detailed-applet.entity';
import { Nullable } from '../../../shared/nullable';

export const DETAILED_APPLET_REPOSITORY = Symbol('DETAILED_APPLET_REPOSITORY');

export interface DetailedAppletRepository {
  findById(id: string): Promise<Nullable<DetailedApplet>>;

  findByUserId(userId: string): Promise<DetailedApplet[]>;

  findByUserConnectionId(userConnectionId: string): Promise<DetailedApplet[]>;

  findPollingApplets(): Promise<DetailedApplet[]>;

  findAll(): Promise<DetailedApplet[]>;
}
