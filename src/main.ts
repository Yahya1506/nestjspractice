/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   // strips out unknown properties
      forbidNonWhitelisted: true, // throws error if extra props sent
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
