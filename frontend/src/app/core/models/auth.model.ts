export type RolUsuario = 'A' | 'D' | 'E';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface UsuarioSesion {
  usu_codigo: number;
  usu_usuario: string;
  usu_rol: RolUsuario;
}

export interface LoginResponse {
  ok: boolean;
  token: string;
  rol: RolUsuario;
  usuario: UsuarioSesion;
  mensaje?: string;
}

export interface Usuario {
  usu_codigo: number;
  usu_usuario: string;
  usu_rol: 'D' | 'E';
}

export interface ListaUsuariosResponse {
  ok: boolean;
  usuarios: Usuario[];
  mensaje?: string;
}