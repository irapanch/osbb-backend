import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users' }) // Вказуємо назву колекції
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  number: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserSchemaOptions = {
  timestamps: true, // Додає поля createdAt і updatedAt
  versionKey: false, // Вимикає версію документа
};
