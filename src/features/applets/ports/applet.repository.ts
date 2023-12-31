/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { Nullable } from '../../../shared/nullable';
import { Applet } from '../entities/applet.entity';

export const APPLET_REPOSITORY = Symbol('APPLET_REPOSITORY');

export interface AppletRepository {
  findById(id: string): Promise<Nullable<Applet>>;

  findByUserId(userId: string): Promise<Applet[]>;

  findByUserConnectionId(userConnectionId: string): Promise<Applet[]>;

  findAll(): Promise<Applet[]>;

  save(applet: Applet): Promise<void>;

  delete(applet: Applet): Promise<void>;
}
