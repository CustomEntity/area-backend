/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-06
 **/

import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ConnectionCredentialsSchema,
  ReactionParametersDataSchema,
  ReactionService,
} from '../ports/reaction.service';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { APPLICATION_REACTION_SERVICE_METADATA } from '../decorators/application-reaction-service.decorator';
import { APPLICATION_REACTION_METADATA } from '../decorators/application-reaction.decorator';
import { z } from 'zod';

@Injectable()
export class ConcreteReactionService implements ReactionService, OnModuleInit {
  private reactionMethodMap = new Map<string, Function>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.discoverAndRegisterApplicationReactionServices();
  }

  private discoverAndRegisterApplicationReactionServices() {
    const providers = this.discoveryService.getProviders();
    const filteredProviders = providers.filter(
      (instanceWrapper: InstanceWrapper) =>
        instanceWrapper.metatype &&
        Reflect.getMetadata(
          APPLICATION_REACTION_SERVICE_METADATA,
          instanceWrapper.metatype,
        ),
    );
    for (const provider of filteredProviders) {
      if (!provider.instance) {
        continue;
      }

      const providerPrototype = Object.getPrototypeOf(provider.instance);
      const serviceMetadata = Reflect.getMetadata(
        APPLICATION_REACTION_SERVICE_METADATA,
        provider.metatype,
      );

      if (!serviceMetadata) {
        continue;
      }

      Object.getOwnPropertyNames(providerPrototype)
        .filter((propertyName) => propertyName !== 'constructor')
        .forEach((methodName) => {
          const reactionMetadata = Reflect.getMetadata(
            APPLICATION_REACTION_METADATA,
            providerPrototype,
            methodName,
          );
          if (reactionMetadata) {
            const key = `${serviceMetadata}:${reactionMetadata}`;
            this.reactionMethodMap.set(
              key,
              provider.instance[methodName].bind(provider.instance),
            );
          }
        });
    }
  }

  executeReaction(
    applicationName: string,
    reactionName: string,
    eventData: Record<string, unknown>,
    reactionParametersData?: z.infer<typeof ReactionParametersDataSchema>,
    reactionConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<void> {
    const key = `${applicationName}:${reactionName}`;
    const method = this.reactionMethodMap.get(key);
    if (method) {
      method(reactionParametersData, eventData, reactionConnectionCredentials);
    } else {
      console.error(`No method found for key: ${key}`);
    }
    return Promise.resolve();
  }
}
