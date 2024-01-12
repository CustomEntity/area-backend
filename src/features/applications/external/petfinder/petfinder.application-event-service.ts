/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-09
 **/

import { ApplicationEventService } from '../../events/decorators/application-event-service.decorator';
import { Inject } from '@nestjs/common';
import {
  KEY_VALUE_STORE_PROVIDER,
  KeyValueStore,
} from '../../../../system/keyvaluestore/key-value-store.provider';
import { ConfigService } from '@nestjs/config';
import { ApplicationEvent } from '../../events/decorators/application-event.decorator';
import { z } from 'zod';
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  TriggerDataSchema,
} from '../../events/ports/event.service';
import { Client } from '@petfinder/petfinder-js';

type Animal = {
  id: number;
  organization_id: string;
  url: string;
  type: string;
  species: string;
  breeds: Breeds;
  colors: Colors;
  age: string;
  gender: string;
  size: string;
  coat: string;
  attributes: Attributes;
  environment: Environment;
  tags: string[];
  name: string;
  description: string;
  organization_animal_id: any;
  photos: Photo[];
  primary_photo_cropped: PrimaryPhotoCropped;
  videos: any[];
  status: string;
  status_changed_at: string;
  published_at: string;
  distance: any;
  contact: Contact;
  _links: Links;
};

export interface Breeds {
  primary: string;
  secondary: any;
  mixed: boolean;
  unknown: boolean;
}

export interface Colors {
  primary: string;
  secondary: any;
  tertiary: any;
}

export interface Attributes {
  spayed_neutered: boolean;
  house_trained: boolean;
  declawed: any;
  special_needs: boolean;
  shots_current: boolean;
}

export interface Environment {
  children: boolean;
  dogs: boolean;
  cats: any;
}

export interface Photo {
  small: string;
  medium: string;
  large: string;
  full: string;
}

export interface PrimaryPhotoCropped {
  small: string;
  medium: string;
  large: string;
  full: string;
}

export interface Contact {
  email: string;
  phone: any;
  address: Address;
}

export interface Address {
  address1: any;
  address2: any;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface Links {
  self: Self;
  type: Type;
  organization: Organization;
}

export interface Self {
  href: string;
}

export interface Type {
  href: string;
}

export interface Organization {
  href: string;
}

@ApplicationEventService('petfinder')
export class PetfinderApplicationEventService {
  constructor(
    @Inject(KEY_VALUE_STORE_PROVIDER)
    private readonly keyValueStore: KeyValueStore,
    private readonly configService: ConfigService,
  ) {}

  @ApplicationEvent('New Adoptable Pet')
  async checkIfNewAdoptablePet(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    const apiKey = this.configService.get<string>(
      'application.petfinder.apiKey',
    );
    const secret = this.configService.get<string>(
      'application.petfinder.secret',
    );

    if (!apiKey || !secret) {
      throw new Error('Missing credentials for Petfinder');
    }
    await this.updateLastPolledAt(appletId);

    const client = new Client({
      apiKey: apiKey,
      secret: secret,
    });

    try {
      const params = {} as any;
      if (eventTriggerData) {
        const { type, size, gender, age, location } = eventTriggerData;
        params.type = type;
        params.size = size;
        params.gender = gender;
        params.age = age;
        params.location = location;
      }

      const response = await client.animal.search(params);

      if (response.data.animals.length === 0) {
        return [];
      }

      const animals = response.data.animals as Animal[];
      const animalsId = animals.map((animal) => animal.id);

      const newAnimals = await this.compareAnimals(appletId, animalsId);
      const newAnimalsData = animals.filter((animal) =>
        newAnimals.includes(animal.id),
      );
      return this.formatNewAnimals(newAnimalsData);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  private async updateLastPolledAt(appletId: string) {
    let lastPolledAt = await this.keyValueStore.get(appletId);
    const currentTime = new Date().toISOString();

    if (lastPolledAt === null) {
      lastPolledAt = currentTime;
      await this.keyValueStore.set(appletId, currentTime, 60 * 60 * 24);
    } else {
      await this.keyValueStore.set(appletId, currentTime, 60 * 60 * 24);
    }
  }

  private async compareAnimals(
    appletId: string,
    animalsId: number[],
  ): Promise<number[]> {
    const lastAnimalsId = await this.keyValueStore.get(appletId + '_animals');

    if (lastAnimalsId === null) {
      await this.keyValueStore.set(
        appletId + '_animals',
        animalsId.join(','),
        60 * 60 * 24,
      );
      return [];
    }

    const lastAnimalsIdArray = lastAnimalsId.split(',');
    const newAnimalsId = animalsId.filter(
      (animalId) => !lastAnimalsIdArray.includes(animalId.toString()),
    );

    await this.keyValueStore.set(
      appletId + '_animals',
      animalsId.join(','),
      60 * 60 * 24,
    );

    return newAnimalsId;
  }

  private formatNewAnimals(
    animals: Animal[],
  ): z.infer<typeof EventDataSchema>[] {
    return animals.map((animal) => {
      return {
        animal_id: animal.id.toString(),
        animal_name: animal.name,
        organization_id: animal.organization_id,
        url: animal.url,
        type: animal.type,
        species: animal.species,
      };
    });
  }
}
