import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ListaUsuariosResponse, Usuario } from '../models/auth.model';

export interface UsuarioInput {
  usu_usuario: string;
  usu_rol: 'D' | 'E';
  /** Solo se envía al crear o cuando se quiere cambiar la contraseña. */
  password?: string;
}

export interface UsuarioMutationResponse {
  ok: boolean;
  mensaje: string;
  usuario?: Usuario;
}

export interface UsuarioDeleteResponse {
  ok: boolean;
  mensaje: string;
}

@Injectable({providedIn: 'root'})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/usuarios`;

  listar(rol?: 'D' | 'E'): Observable<ListaUsuariosResponse> {
    let params = new HttpParams();

    if (rol) {
      params = params.set('rol', rol);
    }

    return this.http.get<ListaUsuariosResponse>(this.url, { params });
  }

  crear(datos: UsuarioInput & { password: string }): Observable<UsuarioMutationResponse> {
    return this.http.post<UsuarioMutationResponse>(this.url, datos);
  }

  editar(id: number, datos: UsuarioInput): Observable<UsuarioMutationResponse> {
    return this.http.put<UsuarioMutationResponse>(`${this.url}/${id}`, datos);
  }

  desactivar(id: number): Observable<UsuarioDeleteResponse> {
    return this.http.delete<UsuarioDeleteResponse>(`${this.url}/${id}`);
  }
}
