import { AuthService } from '@/app/core/services/auth.service';
import { Component, inject, input, output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
 
  sidebarCollapsed = input(false);
  toggleSidebar    = output<void>();
 
  readonly username = this.authService.username;
  readonly isAdmin  = this.authService.isAdmin;
 
  logout(): void {
    this.authService.logout();
  }
}

