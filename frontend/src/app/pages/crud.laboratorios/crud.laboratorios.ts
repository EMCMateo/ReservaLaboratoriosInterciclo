import { Component, inject, signal } from '@angular/core';
import { Laboratorio, LaboratorioInput, LaboratoriosService } from '../../core/services/laboratorios.service';

@Component({ selector: 'app-crud-laboratorios', standalone: true, templateUrl: './crud.laboratorios.html', styleUrl: './crud.laboratorios.css' })
export class CrudLaboratorios {
  private readonly service = inject(LaboratoriosService);
  readonly items = signal<Laboratorio[]>([]);
  readonly editId = signal<number | null>(null);
  readonly mensaje = signal('');
  readonly nombre = signal('');
  readonly ubicacion = signal('1');
  readonly capacidad = signal('1');
  readonly software = signal('');
  readonly foto = signal('');
  readonly estado = signal<'D' | 'M'>('D');

  constructor() { this.cargar(); }
  cargar(): void { this.service.listar().subscribe({ next: r => this.items.set(r.laboratorios), error: e => this.mensaje.set(e.error?.mensaje ?? 'No se pudo cargar laboratorios.') }); }
  seleccionar(l: Laboratorio): void {
    this.editId.set(l.lab_codigo); this.nombre.set(l.lab_nombre); this.ubicacion.set(String(l.LAB_UBICACIONES_ubi_codigo));
    this.capacidad.set(String(l.lab_capacidad)); this.software.set(l.lab_software_usado); this.foto.set(l.lab_foto_url ?? ''); this.estado.set(l.lab_estado); this.mensaje.set('');
  }
  limpiar(): void { this.editId.set(null); this.nombre.set(''); this.ubicacion.set('1'); this.capacidad.set('1'); this.software.set(''); this.foto.set(''); this.estado.set('D'); }
  guardar(): void {
    const data: LaboratorioInput = { lab_nombre: this.nombre().trim(), LAB_UBICACIONES_ubi_codigo: Number(this.ubicacion()), lab_capacidad: Number(this.capacidad()), lab_software_usado: this.software().trim(), lab_foto_url: this.foto().trim() || null, lab_estado: this.estado() };
    const id = this.editId();
    const request = id ? this.service.editar(id, data) : this.service.crear(data);
    request.subscribe({ next: r => { this.mensaje.set(r.mensaje); this.limpiar(); this.cargar(); }, error: e => this.mensaje.set(e.error?.mensaje ?? 'No se pudo guardar el laboratorio.') });
  }
  eliminar(id: number): void { this.service.eliminar(id).subscribe({ next: r => { this.mensaje.set(r.mensaje); this.cargar(); }, error: e => this.mensaje.set(e.error?.mensaje ?? 'No se pudo eliminar el laboratorio.') }); }
}
