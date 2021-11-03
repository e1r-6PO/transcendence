require('https').globalAgent.options.rejectUnauthorized = false;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
