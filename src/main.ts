import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import IORedis from 'ioredis';
import { RedisStore } from 'connect-redis';

import * as session from 'express-session';
// import session from 'express-session';

import { ms, StringValue } from './libs/common/utils/ms.util';
import { parseBoolean } from './libs/common/utils/parse-boolean.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow('REDIS_URI'));
  const frontendPort = config.get<string>('FRONT_PORT');
  const allowedOriginFront = config.get<string>('ALLOW_ORIGIN_FRONT');
  const appPort = config.get<string>('APPLICATION_PORT') || '4300';

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  // глобальна валідація вхідних даних dto
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'), // секретний ключ для підпису ідентифікації сесійних куків
      name: config.getOrThrow<string>('SESSION_NAME'), // назва сесійного кука
      resave: true, // зберігати сесію,навіть якщо вона не була змінена
      saveUninitialized: false, // чи потрібно зберігати не ініціалізовані сесії
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'), // домен для куків
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')), // час життя куків в мілісекундах
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')), // куки доступні тільки через HTTP(S), а не через JavaScript
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')), // куки доступні тільки через HTTPS
        sameSite: 'lax', // Cookie не надсилається у більшості крос-доменних POST-запитів, але надсилається при GET-запитах, як відкриття посилання чи переходу.
      },
      store: new RedisStore({
        // зберігання сесій в Redis
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'), // папка, де будуть зберігатися наші сессії, префікс для ключів Redis
      }),
    }),
  );

  // Дозволяємо CORS для dev и production фронта
  app.enableCors({
    origin: [
      frontendPort, // для локальної розробки
      allowedOriginFront, // для production
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, //для роботи з серверними куками
    exposedHeaders: ['set-cookie'], // Параметр  вказує, які заголовки (headers) браузер має право бачити у відповіді від сервера при запитах з інших доменів (тобто при CORS).
  });
  app.setGlobalPrefix('api'); // https://osbb-backend.onrender.com/api/

  await app.listen(parseInt(appPort) ?? 4300);
}
bootstrap();
