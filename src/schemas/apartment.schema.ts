import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApartmentDocument = Apartment & Document;

@Schema()
export class Resident {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  owner: boolean;
}

@Schema()
export class Apartment {
  @Prop({ required: true })
  _id: number;

  @Prop({ type: [Resident], required: true })
  residents: Resident[];

  @Prop({ required: true })
  balance: number;
}

export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
