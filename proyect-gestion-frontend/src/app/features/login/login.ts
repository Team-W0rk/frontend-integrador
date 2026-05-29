import { AuthService } from '@/app/core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@/app/core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router       = inject(Router);
  private authService  = inject(AuthService);
  private toast        = inject(ToastService);
 
  username     = signal('');
  password     = signal('');
  showPassword = signal(false);
  loading      = signal(false);
  serverError  = signal<string | null>(null);
 
  usernameTouched = signal(false);
  passwordTouched = signal(false);
 
  usernameError = computed<string | null>(() => {
    if (!this.usernameTouched()) return null;
    if (!this.username().trim()) return 'El usuario es requerido';
    return null;
  });
 
  passwordError = computed<string | null>(() => {
    if (!this.passwordTouched()) return null;
    if (!this.password()) return 'La contraseña es requerida';
    if (this.password().length < 6) return 'Mínimo 6 caracteres';
    return null;
  });
 
  hasValidationErrors = computed(() =>
    !this.username().trim() || this.password().length < 6
  );
 
  submit(): void {
    this.usernameTouched.set(true);
    this.passwordTouched.set(true);
 
    if (this.hasValidationErrors()) return;
 
    this.loading.set(true);
    this.serverError.set(null);
 
    this.authService.login({
      username: this.username(),
      password: this.password(),
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success(`¡Bienvenido, ${this.username()}!`);
        setTimeout(() => this.router.navigate(['/dashboard']), 800);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.serverError.set('Usuario o contraseña incorrectos');
          this.toast.error('Credenciales incorrectas');
        } else {
          this.serverError.set('Error al conectar con el servidor');
          this.toast.error('No se pudo conectar al servidor');
        }
      },
    });
  }
 
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}
