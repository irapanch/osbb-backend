import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Account } from './account.schema';
export enum UserRole {
  REGULAR = 'regular',
  ADMIN = 'admin',
}

export enum AuthMethod {
  CREDENTIALS = 'credentials', // Логін і пароль через форму
}
export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}) // Вказуємо назву колекції
export class User {
  @Prop({ type: Types.ObjectId, auto: true })
  // _id?: Types.ObjectId;
  @Expose()
  get id(): string {
    return this._id?.toString() ?? '';
  }
  // доступ до _id через this._id — оголошуємо як приховане поле
  _id?: Types.ObjectId;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Number, required: true })
  number: number;

  @Prop({ enum: UserRole, default: UserRole.REGULAR })
  role: UserRole;

  @Prop({ enum: AuthMethod, default: AuthMethod.CREDENTIALS })
  auth_method: AuthMethod;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Account' }], default: [] })
  accounts: Types.ObjectId[];

  @Prop({ readOnly: true })
  created_at?: Date;

  @Prop({ readOnly: true })
  updated_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
