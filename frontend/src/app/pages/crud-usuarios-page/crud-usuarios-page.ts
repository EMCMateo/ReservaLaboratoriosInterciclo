import { Component, inject, signal } from '@angular/core';
import { Usuarioslist } from '../../components/usuarioslist/usuarioslist';
import { UsuarioService } from '../../core/services/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../../core/models/auth.model';
import { Usuariosadd } from '../../components/usuariosadd/usuariosadd';
import { Usuarioeditar } from '../../components/usuarioeditar/usuarioeditar';
import { Usuarioeliminar } from '../../components/usuarioeliminar/usuarioeliminar';

@Component({
  selector: 'app-crud-usuarios-page',
  imports: [Usuarioslist, Usuariosadd, Usuarioeditar, Usuarioeliminar],
  templateUrl: './crud-usuarios-page.html',
  styleUrl: './crud-usuarios-page.css',
})
export class CrudUsuariosPage {
    private readonly usuariosService = inject(UsuarioService);
    private readonly route = inject(ActivatedRoute);

    readonly rol = this.route.snapshot.routeConfig?.path === 'docentes' ? 'D' : 'E';
    readonly titulo = this.rol === 'D' ? 'Docentes' : 'Estudiantes';

    readonly usuarios = signal<Usuario[]>([]);

    constructor() { this.cargarUsuarios(); }

    cargarUsuarios(): void {
      this.usuariosService.listar(this.rol).subscribe({
        next: (response) => this.usuarios.set(response.usuarios),
        error: (error) => console.error('No se pudo cargar la lista de usuarios:', error)
      });
    }

}
