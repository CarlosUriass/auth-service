import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from './entities/user.entity';
import { GoogleStrategy } from './strategies/google.strategy';

/**
 * Módulo de autenticación.
 *
 * Configura JWT, Passport y la integración con la entidad User.
 * Proporciona servicios de registro, login y validación de JWT.
 */
@Module({
  imports: [
    /**
     * Módulo global de configuración para acceder a variables de entorno.
     */
    ConfigModule,

    /**
     * Passport para autenticación basada en estrategias.
     * Configura 'jwt' como estrategia por defecto.
     */
    PassportModule.register({ defaultStrategy: 'jwt' }),

    /**
     * Configuración dinámica del módulo JWT usando variables de entorno.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),

    /**
     * Registro de la entidad User en TypeORM para usar en AuthService.
     */
    TypeOrmModule.forFeature([User]),
  ],

  /**
   * Controladores expuestos por este módulo.
   */
  controllers: [AuthController],

  /**
   * Proveedores del módulo: servicios y estrategias.
   */
  providers: [AuthService, JwtStrategy, GoogleStrategy],

  /**
   * Exporta AuthService para que pueda ser usado en otros módulos.
   */
  exports: [AuthService],
})
export class AuthModule {}
