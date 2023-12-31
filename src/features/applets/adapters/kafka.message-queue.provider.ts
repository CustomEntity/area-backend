/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { Injectable } from '@nestjs/common';
import { AppletMessageQueue } from '../ports/applet.message-queue';
import { Kafka, Producer } from 'kafkajs';
import { undefined } from 'zod';
import { ConfigService } from '@nestjs/config';
import { DetailedApplet } from '../entities/detailed-applet.entity';
import { Mapper } from '../../../shared/mapper';
import { TriggerData } from '../value-objects/trigger-data.vo';
import { ReactionActionData } from '../value-objects/reaction-action-data.vo';

@Injectable()
export class KafkaMessageQueueProvider implements AppletMessageQueue {
  constructor(
    private readonly configService: ConfigService,
    private readonly producer: Producer,
  ) {}

  async publishAppletExecution(appletId: string): Promise<void> {
    console.log('producer', this.producer);
    await this.producer.send({
      topic:
        this.configService.get<string>('kafka.topics.appletExecution') ||
        'applet-execution',
      messages: [
        {
          value: JSON.stringify({
            appletId,
          }),
        },
      ],
    });
  }

  async bulkPublishAppletExecution(appletIds: string[]): Promise<void> {
    await this.producer.send({
      topic: 'applet-execution',
      messages: appletIds.map((appletId) => ({
        value: JSON.stringify({
          appletId,
        }),
      })),
    });
    console.log('Published', appletIds.length, 'applet executions');
  }
}
