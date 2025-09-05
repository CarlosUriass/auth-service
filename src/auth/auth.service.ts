import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload, JwtUser } from './types/payload.type';

/**
 * Servicio de autenticación
 *
 * Maneja registro de usuarios, validación de credenciales,
 * generación de JWT y login social.
 */
@Injectable()
export class AuthService {
  /** Repositorio de la entidad User para acceder a la base de datos */
  private userRepository: Repository<User>;

  /**
   * Constructor de AuthService
   * @param dataSource Fuente de datos TypeORM para obtener repositorios
   * @param jwtService Servicio para generar y validar JWT
   */
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  /**
   * Valida las credenciales de un usuario
   * @param email Correo electrónico del usuario
   * @param password Contraseña en texto plano
   * @returns La entidad User si las credenciales son válidas
   * @throws UnauthorizedException si el usuario no existe o la contraseña es incorrecta
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  /**
   * Realiza login y genera un JWT para el usuario
   * @param user Entidad User autenticada
   * @returns Objeto con access_token, expiración y datos del usuario
   */
  async login(
    user: User,
  ): Promise<{ access_token: string; expires_in: number; user: JwtUser }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
      name: user.name,
      last_name: user.last_name,
    };

    const token = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode(token) as { exp: number };

    return {
      access_token: token,
      expires_in: decoded.exp,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        rol: user.rol,
      },
    };
  }

  /**
   * Registra un nuevo usuario
   * @param dto DTO con datos de registro
   * @returns Objeto con access_token, expiración y datos del usuario registrado
   * @throws BadRequestException si el email ya está registrado
   */
  async register(
    dto: RegisterDto,
  ): Promise<{ access_token: string; expires_in: number; user: JwtUser }> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepository.create({
      ...dto,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      rol: dto.rol ?? 'user',
    });

    await this.userRepository.save(newUser);

    return this.login(newUser);
  }

  /**
   * Login social (Google, Meta, etc.)
   *
   * Si el usuario no existe, lo crea automáticamente y luego genera el JWT.
   * @param socialUser Objeto con datos del usuario social (email y nombre completo)
   * @returns Objeto con access_token, expiración y datos del usuario
   */
  async socialLogin(socialUser: { email: string; name: string }) {
    let user = await this.userRepository.findOne({
      where: { email: socialUser.email.toLowerCase() },
    });

    if (!user) {
      // Separar nombre y apellidos
      const [firstName, ...lastNameParts] = socialUser.name.split(' ');
      const lastName = lastNameParts.join(' ');

      user = this.userRepository.create({
        email: socialUser.email.toLowerCase(),
        name: firstName,
        last_name: lastName,
        password: '',
        rol: 'user',
      });

      await this.userRepository.save(user);
    }

    return this.login(user);
  }
}
