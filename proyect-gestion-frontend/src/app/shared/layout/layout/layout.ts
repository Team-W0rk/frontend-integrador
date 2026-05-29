import { Component, HostListener, signal } from '@angular/core';
import { Sidebar } from "../../layout/sidebar/sidebar";
import { Navbar } from "../../layout/navbar/navbar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Sidebar, Navbar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  sidebarCollapsed  = signal(false);
  mobileSidebarOpen = signal(false);
 
  // En mobile, colapsar sidebar por defecto
  constructor() {
    if (window.innerWidth < 768) {
      this.sidebarCollapsed.set(true);
    }
  }
 
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    if (width < 768) {
      this.sidebarCollapsed.set(true);
      this.mobileSidebarOpen.set(false);
    }
  }
 
  toggleSidebar(): void {
    if (window.innerWidth < 768) {
      this.mobileSidebarOpen.update(v => !v);
    } else {
      this.sidebarCollapsed.update(v => !v);
    }
  }
 
  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }
}

