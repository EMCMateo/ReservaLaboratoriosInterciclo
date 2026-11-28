import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type EstadoEquipo = 'O' | 'D' | 'R';
export interface Equipo {
  equ_id: number;
  equ_codigo: number;
  equ_estado: EstadoEquipo;
  tipo_codigo: number;
  tip_descripcion: string;
  lab_codigo: number;
  lab_nombre: string;
}
export interface EquipoInput {
  equ_codigo: number;
  equ_estado: EstadoEquipo;
  LAB_LABORATORIOS_lab_codigo: number;
  LAB_TIPOS_EQUIPO_tip_codigo: number;
}
export interface EquiposResponse { ok: boolean; equipos: Equipo[]; }
export interface EquipoMutationResponse { ok: boolean; mensaje: string; equipo: Equipo; }
export interface OperacionResponse { ok: boolean; mensaje: string; }

@Injectable({ providedIn: 'root' })
export class EquiposServices {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/equipos`;

  listar(): Observable<EquiposResponse> { return this.http.get<EquiposResponse>(this.url); }
  crear(datos: EquipoInput): Observable<EquipoMutationResponse> { return this.http.post<EquipoMutationResponse>(this.url, datos); }
  editar(id: number, datos: EquipoInput): Observable<EquipoMutationResponse> { return this.http.put<EquipoMutationResponse>(`${this.url}/${id}`, datos); }
  eliminar(id: number): Observable<OperacionResponse> { return this.http.delete<OperacionResponse>(`${this.url}/${id}`); }
}
