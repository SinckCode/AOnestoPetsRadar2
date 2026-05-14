import 'dotenv/config';
// Logger se inicializa primero (incluye Application Insights)
import { logger } from './config/logger';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    logger.info('[BOOTSTRAP] Creando aplicación NestJS...');
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");
    app.enableCors();

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.info(`[SERVER] API escuchando en puerto ${port}`);
    logger.info(`[SERVER] Base URL: http://localhost:${port}/api`);
  } catch (error) {
    logger.error('[BOOTSTRAP] Error fatal', error);
    process.exit(1);
  }
}

bootstrap();
