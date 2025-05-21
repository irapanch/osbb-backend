import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({
  collection: 'accounts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
}) // зберігає інформацію про різні способи аутентифікації
export class Account {
  @Prop({ type: Types.ObjectId, auto: true })
  _id?: Types.ObjectId;
  @Expose()
  get id(): string {
    return this._id?.toString() ?? '';
  }

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  provider: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  accessToken?: string;

  //  термін дії токена
  @Prop()
  expiresAt?: number; // Unix timestamp (в секундах або мілісекундах)

  @Expose()
  get expiresAtDate(): Date | null {
    return this.expiresAt ? new Date(this.expiresAt * 1000) : null;
  }

  set expiresAtDate(date: Date) {
    this.expiresAt = Math.floor(date.getTime() / 1000);
  }

  //   Як використовувати:
  // typescript
  // const account = new Account();
  // account.expiresAtDate = new Date(); // Збереження поточного часу
  // console.log(account.expiresAt); // Виведе Unix timestamp у секундах
  // console.log(account.expiresAtDate); // Виведе Date об'єкт

  @Prop({ readOnly: true })
  created_at?: Date;

  @Prop({ readOnly: true })
  updated_at?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
