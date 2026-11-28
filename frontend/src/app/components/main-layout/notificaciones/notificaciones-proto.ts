import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-notificaciones-proto',
  standalone: true,
  templateUrl: './notificaciones-proto.html',
  styleUrl: './notificaciones-proto.css'
})
export class NotificacionesProto {
  readonly authService = inject(AuthService);
  readonly usuario = this.authService.usuarioActual;
}
