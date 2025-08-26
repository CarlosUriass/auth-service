import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

/**
 * Módulo principal de la aplicación.
 *
 * Configura la base de datos, carga variables de entorno y registra
 * los módulos principales como AuthModule.
 */
@Module({
  imports: [
    /**
     * ConfigModule configurado como global para acceder a variables
     * de entorno desde cualquier módulo.
     */
    ConfigModule.forRoot({ isGlobal: true }),

    /**
     * Configuración asíncrona de TypeORM para conectarse a la base de datos PostgreSQL.
     * - host, port, username, password y database se obtienen de variables de entorno.
     * - autoLoadEntities permite cargar automáticamente todas las entidades registradas.
     * - synchronize true permite sincronizar entidades con la base de datos (solo para desarrollo).
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: Number(config.get('DATABASE_PORT')),
        username: config.get<string>('DATABASE_USER'),
        password: String(config.get('DATABASE_PASSWORD')),
        database: config.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    /**
     * Módulo de autenticación que maneja registro, login y JWT.
     */
    AuthModule,
  ],
})
export class AppModule {}
