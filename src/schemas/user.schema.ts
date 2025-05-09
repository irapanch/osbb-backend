import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true, versionKey: false }) // Вказуємо назву колекції
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  number: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Account' }] })
  accounts: MongooseSchema.Types.ObjectId[]; // або: Account[] якщо тип Account існує
}

export const UserSchema = SchemaFactory.createForClass(User);
