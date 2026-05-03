import { EstadoUsuario, RolUsuario } from "./enums.model";

export interface Usuario {
  id: number;
  username: string;
  estado: EstadoUsuario;
  rol: RolUsuario;
  creadoEn: string;
  actualizadoEn: string;
}
 
export interface CreateUsuarioDto {
  username: string;
  password: string;
  rol?: RolUsuario;
}
 
export interface UpdateUsuarioDto {
  username?: string;
  password?: string;
  estado?: EstadoUsuario;
  rol?: RolUsuario;
}