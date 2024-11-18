import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  console.log(
    `Application is running on: http://localhost:${process.env.PORT}/${globalPrefix}`,
  );
  await app.listen(process.env.PORT);
}
bootstrap();
