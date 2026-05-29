import { NavItem } from '@/app/core/models/nav.model';
import { AuthService } from '@/app/core/services/auth.service';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private authService = inject(AuthService);
 
  collapsed = input(false);
  closeSidebar = output<void>();
 
  readonly isAdmin = this.authService.isAdmin;
  readonly username = this.authService.username;
 
  navItems: NavItem[] = [
    { label: 'Dashboard',  icon: '📊', route: '/dashboard' },
    { label: 'Proyectos',  icon: '📁', route: '/proyectos' },
    { label: 'Clientes',   icon: '🏢', route: '/clientes' },
    { label: 'Historial',  icon: '📋', route: '/historial' },
    { label: 'Usuarios',   icon: '👥', route: '/usuarios', adminOnly: true },
  ];
 
  get visibleItems(): NavItem[] {
    return this.navItems.filter(i => !i.adminOnly || this.isAdmin());
  }
 
  logout(): void {
    this.authService.logout();
  }
}
