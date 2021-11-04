require('https').globalAgent.options.rejectUnauthorized = false;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { AllExceptionFilter } from './exception/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  // app.useGlobalFilters(new AllExceptionFilter())
  await app.listen(3000);
}
bootstrap();
