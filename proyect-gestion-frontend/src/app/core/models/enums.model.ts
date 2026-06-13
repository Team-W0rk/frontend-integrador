export type EstadoUsuario = 'activo' | 'baja';
export type RolUsuario = 'admin' | 'usuario';
export type EstadoProyecto = 'activo' | 'finalizado' | 'baja';
export type EstadoCliente = 'activo' | 'baja';
export enum EstadoTarea {
  PENDIENTE  = 'pendiente',
  EN_PROGRESO = 'en_progreso',
  FINALIZADO = 'finalizado',
  BAJA       = 'baja',
}
export type EstadoMeta = 'pendiente' | 'completada' | 'baja';
export type TipoContacto = 'email' | 'telefono';