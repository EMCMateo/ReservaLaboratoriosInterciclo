import { Component, inject, input, output, signal } from '@angular/core';
import { Usuario } from '../../../core/models/auth.model';
import { UsuarioService } from '../../../core/services/usuarios.service';

@Component({ selector: 'app-usuarioeditar', standalone: true, templateUrl: './usuarioeditar.html', styleUrl: './usuarioeditar.css' })
export class Usuarioeditar {
  private readonly service = inject(UsuarioService);
  readonly usuarios = input.required<Usuario[]>();
  readonly actualizado = output<void>();
  readonly mensaje = signal('');
  readonly guardando = signal(false);

  guardar(id: string, nombre: string, rol: 'D' | 'E', password: string): void {
    const codigo = Number(id);
    if (!codigo || !nombre.trim()) { this.mensaje.set('Selecciona un usuario e ingresa su nombre.'); return; }
    this.guardando.set(true);
    this.mensaje.set('');
    const datos = { usu_usuario: nombre.trim(), usu_rol: rol, ...(password ? { password } : {}) };
    this.service.editar(codigo, datos).subscribe({
      next: (r) => { this.mensaje.set(r.mensaje); this.guardando.set(false); this.actualizado.emit(); },
      error: (e) => { this.mensaje.set(e.error?.mensaje ?? 'No se pudo actualizar el usuario.'); this.guardando.set(false); }
    });
  }
}
