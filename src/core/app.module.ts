/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppService } from './app.service';
import { AuthModule } from '../features/auth/auth.module';
import { UserModule } from '../features/users/user.module';
import { SystemModule } from '../system/system.module';
import { ApplicationModule } from '../features/applications/application.module';
import { UserConnectionsModule } from '../features/user-connections/user-connections.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppletModule } from '../features/applets/applet.module';
import { EventModule } from '../features/applications/events/event.module';
import { ReactionModule } from '../features/applications/reactions/reaction.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot({
      maxListeners: 100,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    SystemModule,
    ApplicationModule,
    UserConnectionsModule,
    AppletModule,
    EventModule,
    ReactionModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
