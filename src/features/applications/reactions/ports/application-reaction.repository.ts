/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { Nullable } from '../../../../shared/nullable';
import { Reaction } from '../entities/reaction.entity';

export const APPLICATION_REACTION_REPOSITORY = Symbol(
  'APPLICATION_REACTION_REPOSITORY',
);

export interface ApplicationReactionRepository {
  findById(id: string): Promise<Nullable<Reaction>>;

  findByApplicationId(applicationId: string): Promise<Reaction[]>;

  findAll(): Promise<Reaction[]>;
}
