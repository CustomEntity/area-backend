/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/

import { Injectable } from '@nestjs/common';
import { ApplicationReactionRepository } from '../ports/application-reaction.repository';
import { Knex } from 'knex';
import { Reaction } from '../entities/reaction.entity';
import { Nullable } from '../../../../shared/nullable';
import { ParametersMapping } from '../value-objects/parameters-mapping.vo';
import { Mapper } from '../../../../shared/mapper';

const REACTION_TABLE = 'application_reactions';

@Injectable()
export class KnexApplicationReactionRepository
  implements ApplicationReactionRepository
{
  private readonly mapper: KnexReactionMapper = new KnexReactionMapper();

  constructor(private readonly connection: Knex) {}

  async findAll(): Promise<Reaction[]> {
    const reactions = await this.connection(REACTION_TABLE).select();

    return reactions.map((reaction) => this.mapper.toEntity(reaction));
  }

  async findByApplicationId(applicationId: string): Promise<Reaction[]> {
    const reactions = await this.connection(REACTION_TABLE)
      .select()
      .where('application_id', applicationId);

    return reactions.map((reaction) => this.mapper.toEntity(reaction));
  }

  async findById(id: string): Promise<Nullable<Reaction>> {
    const reaction = await this.connection(REACTION_TABLE)
      .select()
      .where('id', id)
      .first();

    if (!reaction) {
      return null;
    }

    return this.mapper.toEntity(reaction);
  }
}

class KnexReactionMapper extends Mapper<Reaction> {
  toEntity(data: any): Reaction {
    return new Reaction({
      id: data.id,
      applicationId: data.application_id,
      name: data.name,
      description: data.description,
      parametersMapping: ParametersMapping.create(data.parameters_mapping),
      createdAt: data.created_at,
    });
  }

  toPersistence(entity: Reaction): any {
    return {
      id: entity.id,
      application_id: entity.applicationId,
      name: entity.name,
      description: entity.description,
      action_mapping: entity.parametersMapping.value,
      created_at: entity.createdAt,
    };
  }
}
