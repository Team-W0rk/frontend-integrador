export interface ResumenEstadisticas {
  proyectos: {
    total: number;
    activos: number;
    finalizados: number;
    baja: number;
    retrasados: number;
  };
  tareas: {
    total: number;
    pendientes: number;
    finalizadas: number;
    baja: number;
  };
  clientes: {
    total: number;
    activos: number;
    baja: number;
  };
  usuarios: {
    total: number;
    activos: number;
  };
}