/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Nullable } from '../../../../shared/nullable';
import { Application } from '../entities/application.entity';

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');

export interface ApplicationRepository {
  findById(id: string): Promise<Nullable<Application>>;

  findByName(name: string): Promise<Nullable<Application>>;

  findAll(): Promise<Application[]>;
}
