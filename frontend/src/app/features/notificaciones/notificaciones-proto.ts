import { Component, inject } from '@angular/core';
import { Session } from '../../core/services/session';

@Component({
  selector: 'app-notificaciones-proto',
  standalone: true,
  templateUrl: './notificaciones-proto.html',
  styleUrl: './notificaciones-proto.css'
})
export class NotificacionesProto {
  readonly session = inject(Session);
}
