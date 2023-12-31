/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import { Injectable } from '@nestjs/common';
import { AppletMessageQueue } from '../ports/applet.message-queue';
import { Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

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
