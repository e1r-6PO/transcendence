require('https').globalAgent.options.rejectUnauthorized = false;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import * as cookieParser from 'cookie-parser';
import { JwtModule } from '@nestjs/jwt/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
