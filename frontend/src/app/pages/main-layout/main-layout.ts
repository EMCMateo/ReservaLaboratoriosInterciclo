import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RolUsuario } from '../../core/models/auth.model';

const ROLE_THEMES: Record<RolUsuario, { label: string; accentColor: string; softBg: string; description: string }> = {
  A: {
    label: 'Administrador',
    accentColor: '#1d4ed8',
    softBg: '#eff6ff',
    description: 'Gestión de laboratorios, incidencias y reportes'
  },
  D: {
    label: 'Docente',
    accentColor: '#0f766e',
    softBg: '#f0fdfa',
    description: 'Reservas de laboratorio y reporte de incidencias'
  },
  E: {
    label: 'Estudiante',
    accentColor: '#7c3aed',
    softBg: '#f5f3ff',
    description: 'Consulta de disponibilidad y reservas de puestos'
  }
};

const NAV_ITEMS: { label: string; route: string; roles: RolUsuario[] }[] = [
  { label: 'Incidencias', route: '/main/incidencias', roles: ['A', 'D', 'E'] },
  { label: 'Notificaciones', route: '/main/notificaciones', roles: ['A', 'D', 'E'] },
  { label: 'Reportes Admin', route: '/main/reportes', roles: ['A'] },
] as const;

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.usuarioActual;
  readonly currentRole = computed(() => this.currentUser()?.usu_rol ?? null);
  readonly theme = computed(() => {
    const role = this.currentRole();
    return role ? ROLE_THEMES[role] : ROLE_THEMES.E;
  });
  readonly mobileMenuOpen = signal(false);

  readonly visibleNavItems = computed(() =>
    NAV_ITEMS.filter((item) => {
      const role = this.currentRole();
      return role !== null && item.roles.includes(role);
    })
  );

  cerrarSesion(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }
}
