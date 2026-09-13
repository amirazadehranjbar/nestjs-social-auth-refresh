import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {


  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true  , unique: true })
  email: string;

  // A bcrypt hash, never the raw password
  @Prop({ required: true })
  passwordHash: string;

  // Hash of the CURRENT refresh token. Storing a hash (not the token itself)
  // means a database leak alone can't be replayed as a valid session.
  @Prop({ default: null ,type: String})
  refreshTokenHash: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
