import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-incidencias-proto',
  standalone: true,
  templateUrl: './incidencias-proto.html',
  styleUrl: './incidencias-proto.css'
})
export class IncidenciasProto {
  readonly authService = inject(AuthService);
  readonly usuario = this.authService.usuarioActual;
}
