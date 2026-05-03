import { AuthService } from '@/app/core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@/app/core/services/alert.service';
import { AlertModal } from "@/app/shared/ui/alert-modal/alert-modal";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertModal],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
   private router      = inject(Router);
  private authService = inject(AuthService);
  private alert       = inject(AlertService);

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
        this.alert.success(
          '¡Bienvenido!',
          `Hola ${this.username()}, iniciaste sesión correctamente.`,
        );
        setTimeout(() => {
          this.alert.close();
          this.router.navigate(['/dashboard']);
        }, 1800);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.serverError.set('Usuario o contraseña incorrectos');
          this.alert.error('Error de acceso', 'Usuario o contraseña incorrectos.');
        } else {
          this.serverError.set('Error al conectar con el servidor');
          this.alert.error('Error de conexión', 'No se pudo conectar al servidor.');
        }
      },
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}
