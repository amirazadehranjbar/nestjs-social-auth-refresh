import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema()
export class UserModel {

    @Prop({})
    name: string

    @Prop({unique: true})
    email: string

    @Prop({})
    password: string
}

export const UserSchema = SchemaFactory.createForClass(UserModel);