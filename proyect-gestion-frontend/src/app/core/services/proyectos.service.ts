import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/enviroments/enviroment.desarrollo';
import { ProyectoResponse } from '../models/proyectos.model';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
    private http = inject(HttpClient);
    private api = `${environment.apiUrl}/proyectos`;

    getAll(search = ''): Observable<ProyectoResponse> {
        let params = new HttpParams();
        if (search) {
        params = params.set('nombre', search);
        }
        return this.http.get<ProyectoResponse>(
        this.api,
        { params }
        );
    }

    create(data: any) {
        return this.http.post(`${this.api}`, data);
    }

    update(id: number, data: any) {
        return this.http.patch(`${this.api}/${id}`, data);
    }

    getById(id: number) {
        return this.http.get<any>(`${this.api}/${id}`);
    }

    delete(id: number) {
        return this.http.delete(
            `${this.api}/${id}`
        );
    }
}