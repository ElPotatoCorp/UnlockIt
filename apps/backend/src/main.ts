import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import applyAppParams, { httpsOptions } from './app.params';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });

  applyAppParams(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
