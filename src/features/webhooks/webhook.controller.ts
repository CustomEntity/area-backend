/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-16
 **/

import {Body, Controller, Get, Param, Post} from "@nestjs/common";

@Controller('webhooks')
export class WebhookController {

    @Post(':applicationName')
    async handleWebhook(
        @Param('applicationName') applicationName: string,
        @Body() body: any,
    ) {
        console.log(body);
        return {success: true};
    }
}
