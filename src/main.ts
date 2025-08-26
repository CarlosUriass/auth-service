import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Función principal que arranca la aplicación NestJS.
 *
 * - Crea la instancia de la aplicación con AppModule.
 * - Configura un ValidationPipe global para:
 *    - Eliminar propiedades no declaradas en los DTOs (`whitelist: true`).
 *    - Lanzar error si se envían propiedades extra (`forbidNonWhitelisted: true`).
 *    - Transformar automáticamente los tipos según los DTOs (`transform: true`).
 *    - Permitir conversión implícita de tipos (`enableImplicitConversion: true`).
 * - Inicia la aplicación en el puerto definido en la variable de entorno `PORT` o 3000 por defecto.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
