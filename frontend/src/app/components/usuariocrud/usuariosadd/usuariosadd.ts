import { Component, inject, input, output, signal } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuariosadd',
  standalone: true,
  templateUrl: './usuariosadd.html',
  styleUrl: './usuariosadd.css',
})
export class Usuariosadd {
  private readonly usuariosService = inject(UsuarioService);

  readonly rol = input.required<'D' | 'E'>();
  readonly usuarioCreado = output<void>();
  readonly nombre = signal('');
  readonly password = signal('');
  readonly mensaje = signal('');
  readonly guardando = signal(false);

  crear(): void {
    const nombre = this.nombre().trim();
    const password = this.password();
    if (!nombre || !password) {
      this.mensaje.set('Completa el nombre y la contraseña.');
      return;
    }

    this.guardando.set(true);
    this.mensaje.set('');
    this.usuariosService.crear({ usu_usuario: nombre, password, usu_rol: this.rol() }).subscribe({
      next: (respuesta) => {
        this.mensaje.set(respuesta.mensaje);
        this.nombre.set('');
        this.password.set('');
        this.guardando.set(false);
        this.usuarioCreado.emit();
      },
      error: (error) => {
        this.mensaje.set(error.error?.mensaje ?? 'No se pudo crear el usuario.');
        this.guardando.set(false);
      }
    });
  }
}
