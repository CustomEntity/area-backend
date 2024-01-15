/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-08
 **/

import { ApplicationEventService } from '../../events/decorators/application-event-service.decorator';
import { ApplicationEvent } from '../../events/decorators/application-event.decorator';
import { Inject } from '@nestjs/common';
import {
  KEY_VALUE_STORE_PROVIDER,
  KeyValueStore,
} from '../../../../system/keyvaluestore/key-value-store.provider';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { TriggerDataSchema } from '../../events/ports/event.service';
import SteamAPI = require('steamapi');

@ApplicationEventService('steam')
export class SteamApplicationEventService {
  constructor(
    @Inject(KEY_VALUE_STORE_PROVIDER)
    private readonly keyValueStore: KeyValueStore,
    private readonly configService: ConfigService,
  ) {}

  @ApplicationEvent('New Owned Game')
  async newOwnedGame(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    executionLogId: string,
    eventConnectionCredentials: { api_key: string },
  ) {
    if (!eventConnectionCredentials || !eventTriggerData) {
      return [];
    }
    try {
      await this.updateLastPolledAt(appletId);

      const profileUrl = this.validateProfileUrl(
        eventTriggerData.profile_url as string,
      );
      const steam = new SteamAPI(eventConnectionCredentials.api_key);
      const user = await steam.resolve(profileUrl);

      const ownedGames = await steam.getUserOwnedGames(user);
      const ownedGamesIds = ownedGames.map((game) => game.appID);

      const newOwnedGames = await this.compareOwnedGames(
        appletId,
        ownedGamesIds,
        ownedGames,
      );
      await this.updateOwnedGamesStore(appletId, ownedGamesIds);

      return this.formatNewOwnedGames(newOwnedGames);
    } catch (error) {
      console.log(error);
    }
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

  private validateProfileUrl(profileUrl: string): string {
    if (!profileUrl) {
      throw new Error('No profile URL provided');
    }
    return profileUrl;
  }

  private async compareOwnedGames(
    appletId: string,
    ownedGamesIds: number[],
    ownedGames: any[],
  ): Promise<any[]> {
    const lastOwnedGamesIds = await this.keyValueStore.get(
      appletId + '_owned_games',
    );

    if (lastOwnedGamesIds === null) {
      await this.keyValueStore.set(
        appletId + '_owned_games',
        ownedGamesIds.join(','),
        60 * 60 * 24,
      );
      return [];
    }

    const lastOwnedGamesIdsArray = lastOwnedGamesIds.split(',').map(Number);
    return ownedGames.filter(
      (game) => !lastOwnedGamesIdsArray.includes(game.appID),
    );
  }

  private async updateOwnedGamesStore(
    appletId: string,
    ownedGamesIds: number[],
  ) {
    await this.keyValueStore.set(
      appletId + '_owned_games',
      ownedGamesIds.join(','),
      60 * 60 * 24,
    );
  }

  private formatNewOwnedGames(newOwnedGames: any[]): any[] {
    return newOwnedGames.map((game) => {
      return {
        game_name: game.name,
        game_id: game.appID,
        game_logo_url: game.logoURL,
        game_icon_url: game.iconURL,
      };
    });
  }
}
