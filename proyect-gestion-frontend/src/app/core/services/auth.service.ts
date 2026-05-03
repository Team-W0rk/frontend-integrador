import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, JwtPayload } from '../models/auth.model';
import { environment } from '../../../enviroments/enviroment.desarrollo';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly api = `${environment.apiUrl}/auth`;

  // Signal reactivo con el token actual
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  readonly isLoggedIn = computed(() => !!this._token());
  readonly currentUser = computed<JwtPayload | null>(() => {
    const token = this._token();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)) as JwtPayload;
    } catch {
      return null;
    }
  });
  readonly isAdmin = computed(() => this.currentUser()?.rol === 'admin');
  readonly username = computed(() => this.currentUser()?.username ?? '');

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, dto).pipe(
        tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        this._token.set(res.access_token);

        this.router.navigate(['/dashboard']);
        }),
    );
    }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}