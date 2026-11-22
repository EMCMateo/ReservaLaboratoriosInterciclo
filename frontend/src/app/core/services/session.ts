import { computed, Injectable, signal } from '@angular/core';

export type UserRole = 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';

export interface RoleTheme {
  label: string;
  accentColor: string;
  softBg: string;
  description: string;
}

export interface NavItem {
  label: string;
  route: string;
  roles: UserRole[];
}

export const ROLE_THEMES: Record<UserRole, RoleTheme> = {
  ADMIN: {
    label: 'Administrador',
    accentColor: '#1d4ed8',
    softBg: '#eff6ff',
    description: 'Gestión de laboratorios, equipos, incidencias y reportes'
  },
  DOCENTE: {
    label: 'Docente',
    accentColor: '#0f766e',
    softBg: '#f0fdfa',
    description: 'Reserva de laboratorio completo y reporte de incidencias'
  },
  ESTUDIANTE: {
    label: 'Estudiante',
    accentColor: '#7c3aed',
    softBg: '#f5f3ff',
    description: 'Reserva de equipos/puestos y consulta de disponibilidad'
  }
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Incidencias', route: '/incidencias', roles: ['ADMIN', 'DOCENTE', 'ESTUDIANTE'] },
  { label: 'Notificaciones', route: '/notificaciones', roles: ['ADMIN', 'DOCENTE', 'ESTUDIANTE'] },
  { label: 'Reportes Admin', route: '/reportes', roles: ['ADMIN'] }
];

@Injectable({ providedIn: 'root' })
export class Session {
  readonly currentRole = signal<UserRole>('ESTUDIANTE');
  readonly activeTheme = computed(() => ROLE_THEMES[this.currentRole()]);

  setRole(role: UserRole): void {
    this.currentRole.set(role);
  }
}
