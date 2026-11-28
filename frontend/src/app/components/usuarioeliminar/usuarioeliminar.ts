import { Component, inject, input, output, signal } from '@angular/core';
import { Usuario } from '../../core/models/auth.model';
import { UsuarioService } from '../../core/services/usuarios.service';

@Component({ selector: 'app-usuarioeliminar', standalone: true, templateUrl: './usuarioeliminar.html', styleUrl: './usuarioeliminar.css' })
export class Usuarioeliminar {
  private readonly service = inject(UsuarioService);
  readonly usuarios = input.required<Usuario[]>();
  readonly eliminado = output<void>();
  readonly mensaje = signal('');
  readonly eliminando = signal(false);

  desactivar(id: string): void {
    const codigo = Number(id);
    if (!codigo) { this.mensaje.set('Selecciona un usuario.'); return; }
    this.eliminando.set(true);
    this.service.desactivar(codigo).subscribe({
      next: (r) => { this.mensaje.set(r.mensaje); this.eliminando.set(false); this.eliminado.emit(); },
      error: (e) => { this.mensaje.set(e.error?.mensaje ?? 'No se pudo desactivar el usuario.'); this.eliminando.set(false); }
    });
  }
}
