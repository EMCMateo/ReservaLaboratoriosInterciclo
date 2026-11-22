import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'incidencias', pathMatch: 'full' },
      {
        path: 'incidencias',
        loadComponent: () =>
          import('./features/incidencias/incidencias-proto').then((m) => m.IncidenciasProto)
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./features/notificaciones/notificaciones-proto').then((m) => m.NotificacionesProto)
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reportes/reportes-proto').then((m) => m.ReportesProto)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
