import {
  Controller,
  UseGuards,
  Req,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import express from 'express';

/**
 * Controlador para la autenticación de usuarios.
 * Proporciona endpoints para registro y login utilizando JWT.
 */
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registra un nuevo usuario en el sistema.
   * @param dto Datos de registro del usuario (correo, contraseña, nombre, apellidos y rol opcional).
   * @returns Objeto con el token JWT, tiempo de expiración y datos del usuario.
   * @throws BadRequestException si el correo ya está registrado.
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      console.error('Register error:', error.message);
      throw error;
    }
  }

  /**
   * Autentica a un usuario existente.
   * @param dto Datos de login del usuario (correo y contraseña).
   * @returns Objeto con el token JWT, tiempo de expiración y datos del usuario.
   * @throws UnauthorizedException si las credenciales son inválidas.
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const user = await this.authService.validateUser(dto.email, dto.password);
      return this.authService.login(user);
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  }

  /**
   * Inicia el flujo de login con Google.
   *
   * Este endpoint redirige al usuario a la página de autorización de Google.
   * El guard `AuthGuard('google')` se encarga de iniciar la autenticación.
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // No se necesita implementación, Passport redirige automáticamente a Google
  }

  /**
   * Callback de Google OAuth2
   *
   * Este endpoint recibe la respuesta de Google después de que el usuario
   * autoriza la app. El guard `AuthGuard('google')` valida la autenticación
   * y coloca el usuario en `req.user`.
   *
   * @param req Request HTTP con el usuario autenticado por Passport
   * @returns JWT generado por AuthService.socialLogin
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: express.Response) {
    const jwt = this.authService.socialLogin(req.user);

    res.cookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.redirect('http://localhost:3000/learn');
  }
}
