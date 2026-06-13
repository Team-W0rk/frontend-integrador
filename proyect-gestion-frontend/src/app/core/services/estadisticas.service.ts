import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/enviroments/enviroment.desarrollo';
import { ResumenEstadisticas } from '../models/estadisticas.model';
import { ProyectoRetrasado, ProyectosPorCliente } from '../models/proyectos.model';
import { TareasPorProyecto } from '../models/tareas.model';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly api = `${environment.apiUrl}/estadisticas`;

  constructor(private http: HttpClient) {}

  getResumen(): Observable<ResumenEstadisticas> {
    return this.http.get<ResumenEstadisticas>(`${this.api}/resumen`);
  }

  getProyectosPorCliente(): Observable<ProyectosPorCliente[]> {
    return this.http.get<ProyectosPorCliente[]>(`${this.api}/proyectos-por-cliente`);
  }

  getTareasPorProyecto(): Observable<TareasPorProyecto[]> {
    return this.http.get<TareasPorProyecto[]>(`${this.api}/tareas-por-proyecto`);
  }

  getProyectosRetrasados(): Observable<ProyectoRetrasado[]> {
    return this.http.get<ProyectoRetrasado[]>(`${this.api}/proyectos-retrasados`);
  }
}