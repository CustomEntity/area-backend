/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-25
 **/
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  TriggerDataSchema,
} from '../../events/ports/event.service';
import { z } from 'zod';
import { ApplicationEventService } from '../../events/decorators/application-event-service.decorator';
import { ApplicationEvent } from '../../events/decorators/application-event.decorator';
import {
  KEY_VALUE_STORE_PROVIDER,
  KeyValueStore,
} from '../../../../system/keyvaluestore/key-value-store.provider';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type Article = {
  section: string;
  subsection: string;
  title: string;
  abstract: string;
  url: string;
  uri: string;
  byline: string;
  item_type: string;
  updated_date: string;
  created_date: string;
  published_date: string;
};

@ApplicationEventService('nytimes')
export class NYTimesApplicationEventService {
  constructor(
    @Inject(KEY_VALUE_STORE_PROVIDER)
    private readonly keyValueStore: KeyValueStore,
    private readonly configService: ConfigService,
  ) {}

  @ApplicationEvent('New Article')
  async checkIfNewArticlePublished(
    appletId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    await this.updateLastPolledAt(appletId);

    const { section } = eventTriggerData;

    const response = await fetch(
      `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${this.configService.get<string>(
        'application.nytimes.apiKey',
      )}`,
    );

    if (!response.ok) {
      throw new Error('Could not fetch articles');
    }

    const data = await response.json();

    const articles = data.results;
    const articlesUri = articles.map((article: Article) => article.uri);

    const newArticles = await this.compareArticles(appletId, articlesUri);
    const newArticlesData = articles.filter((article: Article) =>
      newArticles.includes(article.uri),
    );

    await this.updateArticlesStore(appletId, articlesUri);

    return this.formatNewArticles(newArticlesData);
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

  private async compareArticles(
    appletId: string,
    articlesUri: string[],
  ): Promise<string[]> {
    const lastArticlesUri = await this.keyValueStore.get(
      appletId + '-articles',
    );

    if (lastArticlesUri === null) {
      await this.keyValueStore.set(
        appletId + '-articles',
        articlesUri.join(','),
        60 * 60 * 24,
      );
      return [];
    }

    const lastArticlesUriArray = lastArticlesUri.split(',');
    return articlesUri.filter(
      (articleUri) => !lastArticlesUriArray.includes(articleUri),
    );
  }

  private async updateArticlesStore(appletId: string, articlesUri: string[]) {
    await this.keyValueStore.set(
      appletId + '-articles',
      articlesUri.join(','),
      60 * 60 * 24,
    );
  }

  private formatNewArticles(newArticles: any[]): any[] {
    return newArticles.map((article) => {
      return {
        section: article.section,
        subsection: article.subsection,
        title: article.title,
        abstract: article.abstract,
        url: article.url,
        uri: article.uri,
        byline: article.byline,
        item_type: article.item_type,
        updated_date: article.updated_date,
        created_date: article.created_date,
        published_date: article.published_date,
      };
    });
  }
}
