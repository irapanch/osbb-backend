import { Module } from '@nestjs/common';
import { ApartmentsModule } from './apartments/apartments.module';
import { UsersModule } from './users/users.module';

import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';

dotenv.config();
const mongoUri = process.env.OSBB27_MONGO_URI;

if (!mongoUri) {
  throw new Error('Missing environment variable: OSBB27_MONGO_URI');
}

@Module({
  imports: [MongooseModule.forRoot(mongoUri), ApartmentsModule, UsersModule],
})
export class AppModule {}
