import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/enviroments/enviroment.desarrollo';
import { Cliente } from '../models/clientes.model';


@Injectable({
  providedIn: 'root',
})
export class ClientesService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/clientes`;

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  getActivos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.api}/activos`);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.api}/${id}`);
  }

  create(data: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(this.api, data);
  }

  update(
    id: number,
    data: Partial<Cliente>,
  ): Observable<Cliente> {

    return this.http.patch<Cliente>(
      `${this.api}/${id}`,
      data,
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.patch<Cliente>(
      `${this.api}/${id}/baja`,
      {},
    );
  }

}