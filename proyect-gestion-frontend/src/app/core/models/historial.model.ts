export interface Historial {
  id: number;
  entidad: string;
  entidadId: number;
  accion: string;
  datosAnteriores: Record<string, any> | null;
  datosNuevos: Record<string, any> | null;
  usuarioId: number | null;
  creadoEn: string;
  usuario?: {
    id: number;
    username: string;
  } | null;
}