/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/
import { Nullable } from '../../../../shared/nullable';
import { Event } from '../entities/event.entity';

export const APPLICATION_EVENT_REPOSITORY = Symbol(
  'APPLICATION_EVENT_REPOSITORY',
);

export interface ApplicationEventRepository {
  findById(id: string): Promise<Nullable<Event>>;

  findByApplicationId(applicationId: string): Promise<Event[]>;

  findAll(): Promise<Event[]>;
}
