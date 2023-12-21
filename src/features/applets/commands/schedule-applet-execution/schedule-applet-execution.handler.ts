/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-18
 **/
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {AppletMessageQueue} from "../../ports/applet.message-queue";
import {ScheduleAppletExecutionCommand} from "./schedule-applet-execution.command";
import {AppletRepository} from "../../ports/applet.repository";
import {AppletDoesNotExistError} from "../../exceptions/applet-does-not-exist.error";

@CommandHandler(ScheduleAppletExecutionCommand)
export class ScheduleAppletExecutionHandler implements ICommandHandler<ScheduleAppletExecutionCommand> {


    constructor(
        private readonly messageQueueProvider: AppletMessageQueue,
        private readonly appletRepository: AppletRepository,
    ) {
    }

    async execute(command: ScheduleAppletExecutionCommand): Promise<void> {
        await this.messageQueueProvider.publishAppletExecution(command.appletId);
    }

}