import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RolUsuario,
  UsuarioSesion
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly TOKEN_KEY = 'lab_token';
  private readonly USER_KEY = 'lab_usuario';
  readonly usuarioActual = signal<UsuarioSesion | null>(this.leerUsuarioGuardado());

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credenciales)
      .pipe(
        tap((res) => {
          if (res.ok && res.token) {
            localStorage.setItem(this.TOKEN_KEY, res.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(res.usuario));
            this.usuarioActual.set(res.usuario);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  obtenerUsuario(): UsuarioSesion | null {
    return this.usuarioActual();
  }

  private leerUsuarioGuardado(): UsuarioSesion | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UsuarioSesion;
    } catch {
      return null;
    }
  }

  obtenerRol(): RolUsuario | null {
    return this.usuarioActual()?.usu_rol ?? null;
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken() && !!this.obtenerUsuario();
  }

  tieneRol(rolesPermitidos: RolUsuario[]): boolean {
    const rolActual = this.obtenerRol();
    return rolActual !== null && rolesPermitidos.includes(rolActual);
  }
}
