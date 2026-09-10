import {Module} from '@nestjs/common';
import {createObserveModule} from '@nestjs/observe';
import {AppController} from './app.controller.js';
import {AppService} from './app.service.js';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import { UsersModule } from './users/users.module.js';

export const {ObserveModule, ObserveInstrument} = createObserveModule();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),

        MongooseModule.forRootAsync({

            useFactory: (configService: ConfigService) => ({
                uri: configService.getOrThrow("MONGODB_URI")
            }),

            inject: [ConfigService]
        }),


        ObserveModule.forRoot({
            appKey: 'YOUR_APP_KEY',
            appSecret: 'YOUR_APP_SECRET',
            serviceId: 'nestjs-social-auth-refresh',
        }),


        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
