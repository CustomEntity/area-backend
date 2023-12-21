/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-16
 **/

import {Module} from "@nestjs/common";
import {WebhookController} from "./webhook.controller";

@Module({
    controllers: [WebhookController],
})
export class WebhookModule {}