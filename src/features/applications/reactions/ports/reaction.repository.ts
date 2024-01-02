/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { Nullable } from '../../../../shared/nullable';
import { Reaction } from '../entities/reaction.entity';

export const REACTION_REPOSITORY = Symbol('REACTION_REPOSITORY');

export interface ReactionRepository {
  findById(id: string): Promise<Nullable<Reaction>>;

  findByApplicationId(applicationId: string): Promise<Reaction[]>;

  findAll(): Promise<Reaction[]>;
}
