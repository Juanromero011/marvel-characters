import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common/pipes/index.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Marvel API')
    .setDescription('API de personajes y equipos de Marvel')
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
  
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
