import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import 'reflect-metadata';
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  EventService,
  TriggerDataSchema,
} from '../ports/event.service';
import { z } from 'zod';
import { APPLICATION_EVENT_METADATA } from '../decorators/application-event.decorator';
import { APPLICATION_EVENT_SERVICE_METADATA } from '../decorators/application-event-service.decorator';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

@Injectable()
export class ConcreteEventService implements EventService, OnModuleInit {
  private eventMethodMap = new Map<string, Function>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.discoverAndRegisterApplicationEventServices();
  }

  private discoverAndRegisterApplicationEventServices() {
    const providers = this.discoveryService.getProviders();
    const filteredProviders = providers.filter(
      (instanceWrapper: InstanceWrapper) =>
        instanceWrapper.metatype &&
        Reflect.getMetadata(
          APPLICATION_EVENT_SERVICE_METADATA,
          instanceWrapper.metatype,
        ),
    );
    for (const provider of filteredProviders) {
      if (!provider.instance) {
        continue;
      }

      const providerPrototype = Object.getPrototypeOf(provider.instance);
      const serviceMetadata = Reflect.getMetadata(
        APPLICATION_EVENT_SERVICE_METADATA,
        provider.metatype,
      );

      if (!serviceMetadata) {
        continue;
      }

      Object.getOwnPropertyNames(providerPrototype)
        .filter((propertyName) => propertyName !== 'constructor')
        .forEach((methodName) => {
          const eventMetadata = Reflect.getMetadata(
            APPLICATION_EVENT_METADATA,
            providerPrototype,
            methodName,
          );
          if (eventMetadata) {
            const key = `${serviceMetadata}:${eventMetadata}`;
            this.eventMethodMap.set(
              key,
              provider.instance[methodName].bind(provider.instance),
            );
          }
        });
    }
  }

  async retrieveNewEventsData(
    appletId: string,
    applicationName: string,
    eventName: string,
    executionLogId: string,
    eventTriggerData: z.infer<typeof TriggerDataSchema>,
    eventConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    const key = `${applicationName}:${eventName}`;
    const method = this.eventMethodMap.get(key);
    if (method) {
      return method(
        appletId,
        eventTriggerData,
        executionLogId,
        eventConnectionCredentials,
      );
    } else {
      console.error(`No method found for key: ${key}`);
      return [];
    }
  }
}
