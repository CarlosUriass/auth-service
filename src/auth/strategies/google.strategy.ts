import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

/**
 * Estrategia de autenticación con Google OAuth2
 *
 * Esta estrategia utiliza Passport.js para manejar la autenticación
 * con cuentas de Google, obteniendo el email y nombre del usuario.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  /**
   * Constructor de la estrategia
   * @param configService Servicio para acceder a variables de entorno
   */
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  /**
   * Método que Passport llama automáticamente después de que el usuario
   * se autentica con Google.
   *
   * @param accessToken Token de acceso de Google (no se usa directamente)
   * @param refreshToken Token de refresh de Google (no se usa directamente)
   * @param profile Perfil del usuario devuelto por Google
   * @param done Callback de Passport para indicar que la validación finalizó
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, _json } = profile;

    /**
     * Objeto de usuario simplificado que se pasa al request
     * Se puede usar luego para crear o actualizar el usuario en la DB
     */
    const user = {
      email: emails[0].value,
      name: name?.givenName || _json?.given_name || '',
      last_name: name?.familyName || _json?.family_name || '',
    };

    done(null, user);
  }
}
