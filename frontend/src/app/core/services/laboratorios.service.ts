import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type EstadoLaboratorio = 'D' | 'M';
export interface Laboratorio {
  lab_codigo: number;
  lab_nombre: string;
  LAB_UBICACIONES_ubi_codigo: number;
  ubi_edificio: string;
  ubi_piso: number;
  lab_capacidad: number;
  lab_software_usado: string;
  lab_foto_url: string | null;
  lab_estado: EstadoLaboratorio;
}
export interface LaboratorioInput {
  lab_nombre: string;
  LAB_UBICACIONES_ubi_codigo: number;
  lab_capacidad: number;
  lab_software_usado: string;
  lab_foto_url: string | null;
  lab_estado: EstadoLaboratorio;
}
export interface LaboratoriosResponse { ok: boolean; laboratorios: Laboratorio[]; }
export interface LaboratorioMutationResponse { ok: boolean; mensaje: string; laboratorio: Laboratorio; }
export interface OperacionResponse { ok: boolean; mensaje: string; }

@Injectable({ providedIn: 'root' })
export class LaboratoriosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/laboratorios`;

  listar(): Observable<LaboratoriosResponse> { return this.http.get<LaboratoriosResponse>(this.url); }
  crear(datos: LaboratorioInput): Observable<LaboratorioMutationResponse> { return this.http.post<LaboratorioMutationResponse>(this.url, datos); }
  editar(id: number, datos: LaboratorioInput): Observable<LaboratorioMutationResponse> { return this.http.put<LaboratorioMutationResponse>(`${this.url}/${id}`, datos); }
  eliminar(id: number): Observable<OperacionResponse> { return this.http.delete<OperacionResponse>(`${this.url}/${id}`); }
}
