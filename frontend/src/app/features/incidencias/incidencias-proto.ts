import { Component, inject } from '@angular/core';
import { Session } from '../../core/services/session';

@Component({
  selector: 'app-incidencias-proto',
  standalone: true,
  templateUrl: './incidencias-proto.html',
  styleUrl: './incidencias-proto.css'
})
export class IncidenciasProto {
  readonly session = inject(Session);
}
