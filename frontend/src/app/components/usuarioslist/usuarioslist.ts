import { Component, inject, input, signal } from '@angular/core';
import { Usuario } from '../../core/models/auth.model';

@Component({
  selector: 'app-usuarioslist',
  imports: [],
  templateUrl: './usuarioslist.html',
  styleUrl: './usuarioslist.css',
})
export class Usuarioslist {

  usuarios = input.required<Usuario[]>();
  listName = input.required<string>();
}