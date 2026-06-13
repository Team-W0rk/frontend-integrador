import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/enviroments/enviroment.desarrollo';
import { Tarea } from '../models/tareas.model';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
    private http = inject(HttpClient);
    private api = environment.apiUrl;

    getAll(proyectoId: number): Observable<Tarea[]> {
        return this.http.get<Tarea[]>(
        `${this.api}/proyectos/${proyectoId}/tareas`
        );
    }

    create(
        proyectoId: number,
        data: {
        descripcion: string;
        }
    ): Observable<Tarea> {
        return this.http.post<Tarea>(
        `${this.api}/proyectos/${proyectoId}/tareas`,
        data,
        );
    }

    update(
        proyectoId: number,
        tareaId: number,
        data: Partial<Tarea>,
    ): Observable<Tarea> {

        return this.http.patch<Tarea>(
        `${this.api}/proyectos/${proyectoId}/tareas/${tareaId}`,
        data,
        );
    }

    delete(
        proyectoId: number,
        tareaId: number,
    ): Observable<void> {
        return this.http.delete<void>(
        `${this.api}/proyectos/${proyectoId}/tareas/${tareaId}`,
        );
    }
}