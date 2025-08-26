import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Representa un usuario en el sistema.
 */
@Entity()
export class User {
  /**
   * Identificador único del usuario.
   * Se genera automáticamente como UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Correo electrónico del usuario.
   * Debe ser único en la base de datos.
   */
  @Column({ unique: true })
  email: string;

  /**
   * Contraseña del usuario.
   * Debe almacenarse de forma segura (hashed).
   */
  @Column()
  password: string;

  /**
   * Nombre del usuario.
   */
  @Column()
  name: string;

  /**
   * Apellidos del usuario.
   */
  @Column()
  last_name: string;

  /**
   * Rol del usuario.
   * Valor por defecto: 'user'.
   */
  @Column({ default: 'user' })
  rol: string;
}
