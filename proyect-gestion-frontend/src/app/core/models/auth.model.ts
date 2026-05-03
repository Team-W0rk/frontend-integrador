import { RolUsuario } from "./enums.model";

export interface LoginRequest {
  username: string;
  password: string;
}
 
export interface LoginResponse {
  access_token: string;
}
 
export interface JwtPayload {
  sub: number;
  username: string;
  rol: RolUsuario;
}