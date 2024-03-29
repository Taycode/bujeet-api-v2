import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { Queue } from 'bull';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: '*', // specify the origin(s) that should be allowed to access your API
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // specify the HTTP methods that are allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // specify the headers that are allowed
    credentials: true, // indicate whether or not CORS requests should include credentials (e.g. cookies, authorization headers)
  });

  // Setup BullBoard UI
  const budgetsQueue = app.get<Queue>('BullQueue_budgets');
  const serverAdapter = new ExpressAdapter();
  createBullBoard({
    queues: [new BullAdapter(budgetsQueue)],
    serverAdapter,
  });
  serverAdapter.setBasePath('/admin/queue');
  app.use('/admin/queue', serverAdapter.getRouter());

  // Setup Swagger Docs
  const config = new DocumentBuilder()
    .setTitle('Bujeet API')
    .setDescription('API Documentation for bujeet')
    .setVersion('1.0')
    .addTag('Budgeting')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4141);
}
bootstrap();
