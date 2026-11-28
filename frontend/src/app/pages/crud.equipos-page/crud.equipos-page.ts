import { Component, inject, signal } from '@angular/core';
import { Equipo, EquipoInput, EquiposServices, EstadoEquipo } from '../../core/services/equipos.services';
import { Laboratorio, LaboratoriosService } from '../../core/services/laboratorios.service';

@Component({ selector: 'app-crud-equipos', standalone: true, templateUrl: './crud.equipos-page.html', styleUrl: './crud.equipos-page.css' })
export class CrudEquiposPage {
  private readonly service = inject(EquiposServices);
  private readonly labsService = inject(LaboratoriosService);
  readonly items = signal<Equipo[]>([]);
  readonly laboratorios = signal<Laboratorio[]>([]);
  readonly editId = signal<number | null>(null);
  readonly mensaje = signal('');
  readonly codigo = signal('');
  readonly tipo = signal('1');
  readonly laboratorio = signal('');
  readonly estado = signal<EstadoEquipo>('O');

  constructor() { this.cargar(); this.labsService.listar().subscribe({ next: r => this.laboratorios.set(r.laboratorios), error: e => this.mensaje.set(e.error?.mensaje ?? 'No se pudieron cargar laboratorios.') }); }
  cargar(): void { this.service.listar().subscribe({ next: r => this.items.set(r.equipos), error: e => this.mensaje.set(e.error?.mensaje ?? 'No se pudieron cargar equipos.') }); }
  seleccionar(e: Equipo): void { this.editId.set(e.equ_id); this.codigo.set(String(e.equ_codigo)); this.tipo.set(String(e.tipo_codigo)); this.laboratorio.set(String(e.lab_codigo)); this.estado.set(e.equ_estado); this.mensaje.set(''); }
  limpiar(): void { this.editId.set(null); this.codigo.set(''); this.tipo.set('1'); this.laboratorio.set(''); this.estado.set('O'); }
  guardar(): void {
    const data: EquipoInput = { equ_codigo: Number(this.codigo()), LAB_TIPOS_EQUIPO_tip_codigo: Number(this.tipo()), LAB_LABORATORIOS_lab_codigo: Number(this.laboratorio()), equ_estado: this.estado() };
    const id = this.editId();
    const request = id ? this.service.editar(id, data) : this.service.crear(data);
    request.subscribe({ next: r => { this.mensaje.set(r.mensaje); this.limpiar(); this.cargar(); }, error: e => this.mensaje.set(e.error?.mensaje ?? 'No se pudo guardar el equipo.') });
  }
  eliminar(id: number): void { this.service.eliminar(id).subscribe({ next: r => { this.mensaje.set(r.mensaje); this.cargar(); }, error: e => this.mensaje.set(e.error?.mensaje ?? 'No se pudo eliminar el equipo.') }); }
}
