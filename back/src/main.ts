import { LogLevel, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // configService is not use here because AppModule is not yet created
  const logLevel = process.env.LOG_LEVEL?.split(',') as LogLevel[];
  const app = await NestFactory.create(AppModule, { logger: logLevel });

  // API
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  const port = process.env.PORT;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.debug('🚀 Application start');
}
bootstrap();
