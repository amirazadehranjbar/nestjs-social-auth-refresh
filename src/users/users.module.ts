import {Module} from '@nestjs/common';
import {UsersService} from './users.service.js';
import {UsersController} from './users.controller.js';
import {MongooseModule} from "@nestjs/mongoose";
import {UserModel, UserSchema} from "./schemas/userSchema.js";

@Module({

    imports: [MongooseModule.forFeature([
        {name: UserModel.name, schema: UserSchema}
    ])],


    providers: [UsersService],

    controllers: [UsersController]
})
export class UsersModule {
}
