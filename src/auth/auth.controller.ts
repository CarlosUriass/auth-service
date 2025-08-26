import {
  Controller,
  UseGuards,
  Req,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, RegisterDto } from './dto/auth.dto';

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
}
