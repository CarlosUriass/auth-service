/**
 * Payload que se incluye dentro del JWT.
 */
export interface JwtPayload {
  /**
   * Identificador único del usuario.
   */
  sub: string;

  /**
   * Correo electrónico del usuario.
   */
  email: string;

  /**
   * Rol del usuario.
   * Ejemplo: 'user', 'admin', etc.
   */
  rol: string;

  /**
   * Nombre del usuario.
   */
  name: string;

  /**
   * Apellidos del usuario.
   */
  last_name: string;
}

/**
 * Objeto que representa al usuario autenticado después de validar el JWT.
 */
export interface JwtUser {
  /**
   * Identificador único del usuario.
   */
  userId: string;

  /**
   * Correo electrónico del usuario.
   */
  email: string;

  /**
   * Nombre del usuario.
   */
  name: string;

  /**
   * Apellidos del usuario.
   */
  last_name: string;

  /**
   * Rol del usuario.
   */
  rol: string;
}
