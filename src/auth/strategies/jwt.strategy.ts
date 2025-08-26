import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload, JwtUser } from '../types/payload.type';

/**
 * Estrategia de autenticación JWT para Passport.
 * Extrae el token JWT del encabezado Authorization y valida su contenido.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Crea una nueva instancia de JwtStrategy.
   * @param configService Servicio de configuración para obtener el secreto JWT.
   * @throws Error si no se encuentra definido JWT_SECRET en el .env
   */
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET must be defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  /**
   * Valida el payload del JWT y devuelve un objeto JwtUser tipado.
   * Este método es llamado automáticamente por Passport después de decodificar el token.
   *
   * @param req Objeto de la solicitud Express.
   * @param payload Payload decodificado del JWT.
   * @returns Objeto JwtUser con los datos del usuario.
   */
  async validate(req: Request, payload: JwtPayload): Promise<JwtUser> {
    const rol = payload.rol ?? 'user';

    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      last_name: payload.last_name,
      rol,
    };
  }
}
