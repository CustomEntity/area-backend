/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-17
 **/

import {Module} from "@nestjs/common";
import {ScheduleAppletExecutionTask} from "./tasks/schedule-applet-execution.task";
import {KnexModule} from "../../core/adapters/knex/knex.module";
import {CommandBus, CqrsModule} from "@nestjs/cqrs";
import {SystemModule} from "../../system/system.module";
import {ScheduleAppletExecutionHandler} from "./commands/schedule-applet-execution/schedule-applet-execution.handler";
import {MESSAGE_QUEUE_PROVIDER, AppletMessageQueue} from "./ports/applet.message-queue";
import {
    ScheduleAllAppletsExecutionHandler
} from "./commands/schedule-all-applets-execution/schedule-all-applets-execution.handler";
import {APPLET_REPOSITORY, AppletRepository} from "./ports/applet.repository";
import {KnexAppletRepository} from "./adapters/knex.applet.repository";
import {KnexService} from "../../core/adapters/knex/knex.service";
import {AppletConsumer} from "./consumers/applet.consumer";
import {KafkaService} from "../../core/adapters/kafka/kafka.service";
import {ConfigService} from "@nestjs/config";
import {KafkaMessageQueueProvider} from "./adapters/kafka.message-queue.provider";
import {KafkaModule} from "../../core/adapters/kafka/kafka.module";
import {BullshitTask} from "./tasks/bullshit.task";
import {
    USER_CONNECTION_REPOSITORY,
    UserConnectionRepository
} from "../user-connections/ports/user-connection.repository";
import {UserConnectionsModule} from "../user-connections/user-connections.module";
import {ExecuteAppletHandler} from "./commands/execute-applet/execute-applet.handler";

@Module({
    imports: [KnexModule, CqrsModule, SystemModule, KafkaModule, UserConnectionsModule],
    providers: [
        ScheduleAppletExecutionTask,
        {
            provide: BullshitTask,
            useFactory: (userConnectionRepository: UserConnectionRepository) => {
                return new BullshitTask(userConnectionRepository);
            },
            inject: [USER_CONNECTION_REPOSITORY],
        },
        {
            provide: MESSAGE_QUEUE_PROVIDER,
            useFactory: async (kafkaService: KafkaService, configService: ConfigService) => {
                await kafkaService.init();
                return new KafkaMessageQueueProvider(configService, kafkaService.producer);
            },
            inject: [KafkaService, ConfigService],
        },
        {
            provide: APPLET_REPOSITORY,
            useFactory: (knexService: KnexService) => {
                return new KnexAppletRepository(knexService.connection);
            },
            inject: [KnexService],
        },
        {
            provide: ScheduleAppletExecutionHandler,
            useFactory: (
                messageQueueProvider: AppletMessageQueue,
                appletRepository: AppletRepository,
            ) => {
                return new ScheduleAppletExecutionHandler(messageQueueProvider, appletRepository);
            },
            inject: [MESSAGE_QUEUE_PROVIDER, APPLET_REPOSITORY],
        },
        {
            provide: ScheduleAllAppletsExecutionHandler,
            useFactory: (
                messageQueueProvider: AppletMessageQueue,
                appletRepository: AppletRepository,
            ) => {
                return new ScheduleAllAppletsExecutionHandler(messageQueueProvider, appletRepository);
            },
            inject: [MESSAGE_QUEUE_PROVIDER, APPLET_REPOSITORY],
        },
        {
            provide: ExecuteAppletHandler,
            useFactory: (
                appletRepository: AppletRepository,
            ) => {
                return new ExecuteAppletHandler(appletRepository);
            },
            inject: [APPLET_REPOSITORY],
        },
        AppletConsumer,
    ],
    controllers: [],
    exports: [],
})
export class AppletModule {
}