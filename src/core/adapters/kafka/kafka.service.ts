/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import * as assert from 'assert';
import { DiscoveryService } from '@nestjs/core';
import { KAFKA_CONSUMER_METHOD_METADATA } from '../../decorators/consumer.decorator';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  private isReady = false;
  private readonly kafka: Kafka;
  private readonly _producer: Producer;
  private readonly _consumer: Consumer;
  private topicHandlers: Map<string, Function> = new Map();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly configService: ConfigService,
  ) {
    assert(
      this.configService.get<string>('kafka.brokers'),
      'Kafka brokers must be defined',
    );
    assert(
      this.configService.get<string>('kafka.username'),
      'Kafka username must be defined',
    );
    assert(
      this.configService.get<string>('kafka.password'),
      'Kafka password must be defined',
    );

    try {
      const kafkaConfig: any = {
        brokers: this.configService.get<string[]>('kafka.brokers') || [
          'localhost:9092',
        ],
        ssl: false,
      };

      if (this.configService.get<boolean>('kafka.sasl')) {
        kafkaConfig.sasl = {
          mechanism: 'scram-sha-256',
          username: this.configService.get<string>('kafka.username')!,
          password: this.configService.get<string>('kafka.password')!,
        };
      }

      if (this.configService.get<boolean>('kafka.ssl')) {
        kafkaConfig.ssl = true;
      }

      this.logger.log('KafkaService: Initializing Kafka Client');
      this.kafka = new Kafka(kafkaConfig);
      this._producer = this.kafka.producer({
        allowAutoTopicCreation: true,
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      });
      this._consumer = this.kafka.consumer({
        groupId: this.configService.get<string>('kafka.groupId') || 'my-group',
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      });
      this.logger.log('KafkaService: Kafka Client Initialized');
    } catch (error) {
      this.logger.error('Error initializing KafkaService', error.stack);
      throw error;
    }
  }

  async onModuleInit() {
    try {
      await this.init();
      await this.discoverAndSetupConsumers();
      await this.startConsuming();
      this.logger.log('KafkaService: Module initialized successfully');
    } catch (error) {
      this.logger.error('Error during module initialization', error.stack);
    }
  }

  async discoverAndSetupConsumers() {
    const instances = this.discoveryService.getProviders();
    for (const instance of instances) {
      if (!instance.instance) {
        continue;
      }

      const prototype = Object.getPrototypeOf(instance.instance);
      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (item) =>
          typeof prototype[item] === 'function' &&
          Reflect.hasMetadata(KAFKA_CONSUMER_METHOD_METADATA, prototype[item]),
      );

      for (const methodName of methodNames) {
        const method = prototype[methodName];
        const topic = Reflect.getMetadata(
          KAFKA_CONSUMER_METHOD_METADATA,
          method,
        );
        await this.setupConsumer(topic, method.bind(instance.instance));
      }
    }
  }

  private async setupConsumer(topic: string, handler: Function) {
    try {
      this.logger.log(`KafkaService: Subscribing to topic ${topic}`);
      if (!this.topicHandlers.has(topic)) {
        await this._consumer.subscribe({ topic, fromBeginning: true });
        this.topicHandlers.set(topic, handler);
      }
    } catch (error) {
      this.logger.error(
        `Error setting up consumer for topic ${topic}`,
        error.stack,
      );
    }
  }

  async startConsuming() {
    try {
      await this._consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const handler = this.topicHandlers.get(topic);
          if (handler) {
            try {
              if (message.value) handler(JSON.parse(message.value.toString()));
            } catch (error) {
              console.error(
                `Error processing message from topic ${topic}:`,
                error,
              );
            }
          }
        },
      });
      this.logger.log('KafkaService: Started consuming messages');
    } catch (error) {
      this.logger.error('Error starting the consuming process', error.stack);
    }
  }

  async init() {
    if (this.isReady) {
      return;
    }
    this.isReady = true;

    try {
      this.logger.log(
        'KafkaService: Connecting to Kafka Producer and Consumer',
      );
      await this._producer.connect();
      await this._consumer.connect();
      this.logger.log('KafkaService: Connected to Kafka Producer and Consumer');
    } catch (error) {
      this.logger.error(
        'Error connecting to Kafka Producer and Consumer',
        error.stack,
      );
    }
  }

  get connection(): Kafka {
    return this.kafka;
  }

  get producer(): Producer {
    return this._producer;
  }

  get consumer(): Consumer {
    return this._consumer;
  }
}
