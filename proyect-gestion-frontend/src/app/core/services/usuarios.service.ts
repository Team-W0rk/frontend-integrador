import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/enviroments/enviroment.desarrollo';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
    private http = inject(HttpClient);

    private api = `${environment.apiUrl}/usuarios`;

    getAll(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.api);
    }

    getById(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(
        `${this.api}/${id}`
        );
    }

    create(
        data: Partial<Usuario> & {
        password?: string;
        }
    ): Observable<Usuario> {

        return this.http.post<Usuario>(
        this.api,
        data,
        );
    }

    update(
        id: number,
        data: Partial<Usuario> & {
        password?: string;
        }
    ): Observable<Usuario> {

        return this.http.patch<Usuario>(
        `${this.api}/${id}`,
        data,
        );
    }

    delete(id: number): Observable<Usuario> {
        return this.http.patch<Usuario>(
        `${this.api}/${id}/baja`,
        {},
        );
    }
}