require('https').globalAgent.options.rejectUnauthorized = false;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import * as cookieParser from 'cookie-parser';
// import { AllExceptionFilter } from './exception/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  // app.useGlobalFilters(new AllExceptionFilter())
  await app.listen(3000);
}
bootstrap();
