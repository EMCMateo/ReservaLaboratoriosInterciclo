import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAV_ITEMS, Session, UserRole } from '../../core/services/session';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  private readonly session = inject(Session);

  readonly roles: UserRole[] = ['ADMIN', 'DOCENTE', 'ESTUDIANTE'];
  readonly currentRole = this.session.currentRole;
  readonly theme = this.session.activeTheme;
  readonly mobileMenuOpen = signal(false);

  readonly visibleNavItems = computed(() =>
    NAV_ITEMS.filter((item) => item.roles.includes(this.currentRole()))
  );

  onRoleChange(role: UserRole): void {
    this.session.setRole(role);
    this.mobileMenuOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }
}
