import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema()
export class UserModel {

    @Prop({type: Types.ObjectId, auto: true})
    _id: Types.ObjectId

    @Prop({})
    name: string

    @Prop({unique: true})
    email: string

    @Prop({})
    password: string
}

export const UserSchema = SchemaFactory.createForClass(UserModel);