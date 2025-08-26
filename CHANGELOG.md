# Changelog

## [Unreleased]

## [2025-08-26] - Carlos Urias

### Added

- Implementación del módulo de autenticación (`AuthModule`) con NestJS.
- Servicio de autenticación (`AuthService`) con:
  - Método `register` para crear nuevos usuarios con hash de contraseña.
  - Método `login` para generación de JWT y retorno de datos del usuario.
  - Validación de credenciales con `validateUser`.
- Controlador de autenticación (`AuthController`) con endpoints:
  - `POST /auth/register` para registrar usuarios.
  - `POST /auth/login` para iniciar sesión.
- DTOs para validación de entrada usando `class-validator`:
  - `RegisterDto` y `LoginDto` con validaciones de email, password, nombre y apellidos.
- Estrategia JWT (`JwtStrategy`) para validación de tokens en rutas protegidas.
- Integración de `TypeOrmModule` para persistencia de `User` en PostgreSQL.
- `ValidationPipe` global en `main.ts` con:
  - `whitelist` para eliminar propiedades no definidas en DTOs.
  - `forbidNonWhitelisted` para lanzar error si se envían propiedades extra.
  - Transformación automática de tipos (`transform: true`).

### Notes

- Configuración de `.env` para conexión con PostgreSQL y `JWT_SECRET`.
- Se habilitó `synchronize: true` temporalmente para pruebas de migración de entidades.
- Todos los métodos y clases incluyen documentación JSDoc para mayor claridad.
