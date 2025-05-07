import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApartmentsModule } from './apartments/apartments.module';
import { UsersModule } from './users/users.module';

import { MongooseModule } from '@nestjs/mongoose';

import { IS_DEV_ENV } from './libs/common/utils/is-dev.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV, // Ігноруємо .env файл в продакшені
      isGlobal: true, // Это позволяет использовать ConfigService в любом месте проекта
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('OSBB27_MONGO_URI');
        if (!uri) {
          throw new Error('Missing environment variable: OSBB27_MONGO_URI');
        }
        return {
          uri,
        };
      },
    }),
    ApartmentsModule,
    UsersModule,
  ],
})
export class AppModule {}
