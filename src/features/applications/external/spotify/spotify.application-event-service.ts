/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-07
 **/

import { ApplicationEventService } from '../../events/decorators/application-event-service.decorator';
import {
  KEY_VALUE_STORE_PROVIDER,
  KeyValueStore,
} from '../../../../system/keyvaluestore/key-value-store.provider';
import { Inject } from '@nestjs/common';
import { ApplicationEvent } from '../../events/decorators/application-event.decorator';
import { Playlist, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  TriggerDataSchema,
} from '../../events/ports/event.service';
import * as querystring from 'querystring';

@ApplicationEventService('spotify')
export class SpotifyApplicationEventService {
  constructor(
    @Inject(KEY_VALUE_STORE_PROVIDER)
    private readonly keyValueStore: KeyValueStore,
    private readonly configService: ConfigService,
  ) {}

  private async getNewAccessToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string,
  ): Promise<string> {
    const authOptions = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    };

    try {
      const response = await fetch(authOptions.url, {
        method: authOptions.method,
        headers: authOptions.headers,
        body: authOptions.body,
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing access token', error);
      throw new Error('Failed to refresh access token');
    }
  }

  @ApplicationEvent('New playlist')
  async checkNewPlaylistWasCreated(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    executionLogId: string,
    eventConnectionCredentials?: {
      access_token: string;
      refresh_token: string;
    },
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    if (!eventConnectionCredentials) {
      return [];
    }
    let lastPolledAt = await this.keyValueStore.get(appletId);
    if (lastPolledAt === null) {
      lastPolledAt = new Date().toISOString();
      await this.keyValueStore.set(appletId, lastPolledAt, 60 * 60 * 24);
      return [];
    }

    await this.keyValueStore.set(
      appletId,
      new Date().toISOString(),
      60 * 60 * 24,
    );

    const clientId = this.configService.get<string>('oauth.spotify.clientId');
    const clientSecret = this.configService.get<string>(
      'oauth.spotify.clientSecret',
    );

    if (
      clientId === undefined ||
      clientSecret === undefined ||
      eventConnectionCredentials.refresh_token === undefined
    ) {
      throw new Error('Spotify OAuth not configured');
    }

    const accessToken = await this.getNewAccessToken(
      eventConnectionCredentials.refresh_token as string,
      clientId,
      clientSecret,
    );

    if (accessToken === undefined) {
      throw new Error('Failed to retrieve access token');
    }

    const sdk = SpotifyApi.withAccessToken(clientId, {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: eventConnectionCredentials.refresh_token as string,
    });

    const playlists = await sdk.currentUser.playlists.playlists();

    const playlistIds = playlists.items.map((playlist) => playlist.id);
    const lastPolledIds = await this.keyValueStore.get(
      `${appletId}-lastPolledIds`,
    );
    if (lastPolledIds === null) {
      await this.keyValueStore.set(
        `${appletId}-lastPolledIds`,
        playlistIds.join(','),
        60 * 60 * 24,
      );
      return [];
    }

    const lastPolledIdsArray = lastPolledIds.split(',');
    const newPlaylists = playlists.items.filter(
      (playlist) => !lastPolledIdsArray.includes(playlist.id),
    );

    await this.keyValueStore.set(
      `${appletId}-lastPolledIds`,
      playlistIds.join(','),
      60 * 60 * 24,
    );

    return newPlaylists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      url: playlist.external_urls.spotify,
      owner: playlist.owner.display_name,
      ownerUrl: playlist.owner.external_urls.spotify,
      imageUrl: playlist.images[0].url,
    }));
  }
}
