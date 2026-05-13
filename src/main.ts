import * as appInsights from 'applicationinsights';

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
