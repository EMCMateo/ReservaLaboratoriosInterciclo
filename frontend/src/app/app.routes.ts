import { Routes } from '@angular/router';
import { MainLayout } from './pages/main-layout/main-layout';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { IncidenciasProto } from './components/main-layout/incidencias/incidencias-proto';
import { NotificacionesProto } from './components/main-layout/notificaciones/notificaciones-proto';
import { ReportesProto } from './components/main-layout/reportes/reportes-proto';
import { Login } from './components/auth/login/login';
import { Inicio } from './components/main-layout/inicio/inicio';
import { CrudUsuariosPage } from './pages/crud-usuarios-page/crud-usuarios-page';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'main',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Inicio, pathMatch: 'full' },
      {
        path: 'incidencias',
        component : IncidenciasProto
      },
      {
        path: 'notificaciones',
        component : NotificacionesProto  
      },
      {
        path: 'reportes',
        canActivate: [roleGuard(['A'])],
        component : ReportesProto  
      },
      {
        path: 'docentes',
        canActivate: [roleGuard(['A'])],
        component : CrudUsuariosPage
      },
      {
        path :'estudiantes',
        canActivate :[roleGuard(['A'])],
        component : CrudUsuariosPage
      }
    ]
  },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  
  { path: '**', redirectTo: 'login' },
  
];
