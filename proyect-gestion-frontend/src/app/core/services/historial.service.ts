import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/enviroments/enviroment.desarrollo';
import { Historial } from '../models/historial.model';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
    private http = inject(HttpClient);
    private api = `${environment.apiUrl}/historial`;

    getAll():
        Observable<Historial[]> {
        return this.http.get<
        Historial[]
        >(this.api);
    }

    getByEntidad(
        entidad: string,
        id: number
    ): Observable<Historial[]> {
        return this.http.get< Historial[] >(
        `${this.api}/${entidad}/${id}`
        );
    }
}