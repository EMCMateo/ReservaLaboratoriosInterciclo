import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
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
        canActivate: [roleGuard(['A'])],
        loadComponent: () =>
          import('./features/reportes/reportes-proto').then((m) => m.ReportesProto)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];