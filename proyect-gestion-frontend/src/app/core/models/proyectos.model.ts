import { Tarea } from "./tareas.model";

export interface Proyecto {
  id: number;
  nombre: string;
  estado: 'activo' | 'finalizado' | 'baja';
  fechaFin: string | null;
  cliente?: {
    id: number;
    nombre: string;
  };
  tareas?: Tarea[];
}

export interface ProyectoResponse {
  datos: Proyecto[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface ProyectosPorCliente {
  cliente: string;
  total: string;
  activos: string;
  finalizados: string;
}

export interface ProyectoRetrasado {
  id: number;
  nombre: string;
  cliente: string;
  fechaFin: string;
  diasRetraso: number;
}