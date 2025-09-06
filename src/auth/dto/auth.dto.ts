import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * DTO para el inicio de sesión de usuarios.
 */
export class LoginDto {
  /**
   * Correo electrónico del usuario.
   * Debe ser un email válido.
   */
  @IsEmail()
  email: string;

  /**
   * Contraseña del usuario.
   * Debe ser una cadena de texto.
   */
  @IsString()
  password: string;
}

/**
 * DTO para el registro de un nuevo usuario.
 */
export class RegisterDto {
  /**
   * Correo electrónico del usuario.
   * Debe ser un email válido.
   */
  @IsEmail()
  email: string;

  /**
   * Contraseña del usuario.
   * Debe ser una cadena de texto con al menos 6 caracteres.
   */
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Nombre del usuario.
   */
  @IsString()
  first_name: string;

  /**
   * Apellidos del usuario.
   */
  @IsString()
  last_name: string;

  /**
   * Rol del usuario.
   * Opcional. Por defecto puede ser 'user'.
   */
  @IsOptional()
  @IsString()
  rol?: string;
}
