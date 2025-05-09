import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ collection: 'accounts', timestamps: true, versionKey: false })
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String })
  phone: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
