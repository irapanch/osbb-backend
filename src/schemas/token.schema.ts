import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TokenType {
  VERIFICATION = 'verification',
  PASSWORD_RESET = 'password_reset',
}

export type TokenDocument = Token & Document;

@Schema({
  collection: 'tokens',
  versionKey: false,
})
export class Token {
  @Prop({ type: Types.ObjectId, auto: true })
  _id?: Types.ObjectId;

  //   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  //   user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  account: Types.ObjectId;

  @Prop({ required: true, type: String })
  accessToken: string;

  @Prop({ enum: TokenType, default: TokenType.VERIFICATION })
  type: TokenType;

  @Prop()
  expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
