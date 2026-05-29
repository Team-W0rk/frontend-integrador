export interface Tarea {
  id: number;
  descripcion: string;
  estado: string;
  proyectoId: number;
  metaId?: number | null;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface TareasPorProyecto {
  proyectoid: number;
  proyecto: string;
  total: string;
  pendientes: string;
  finalizadas: string;
}