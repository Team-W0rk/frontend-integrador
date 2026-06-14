import { Cliente, ContactoCliente } from '@/app/core/models/clientes.model';
import { ClientesService } from '@/app/core/services/clientes.service';
import { PageHeader } from '@/app/shared/layout/page-header/page-header';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ToastModule, ReactiveFormsModule, PageHeader,],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})

export class ClienteForm {
  private fb = inject(FormBuilder);
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  loading = signal(false);
  saving = signal(false);
  editando = signal(false);
  clienteId = signal<number | null>(null);

  // =========================
  // FORM PRINCIPAL
  // =========================
  form = this.fb.group({
    nombre: [
      '',
      [Validators.required, Validators.minLength(3)],
    ],

    contactos: this.fb.array<FormGroup>([], this.noDuplicadosContactos()),
  });

  // =========================
  // GETTER CONTACTOS
  // =========================
  get contactos(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editando.set(true);
      this.clienteId.set(Number(id));
      this.cargarCliente(Number(id));
    } else {
      this.agregarContacto(); // UX: uno vacío al crear
    }
  }

  // =========================
  // CONTACTO FORM GROUP
  // =========================
  crearContacto(
    tipo: 'telefono' | 'email' = 'telefono',
    valor = '',
    etiqueta = '',
  ): FormGroup {
    return this.fb.group(
      {
        tipo: [tipo, Validators.required],
        valor: [valor, Validators.required],
        etiqueta: [etiqueta],
      },
      {
        validators: this.contactoValidator(),
      },
    );
  }

  // =========================
  // VALIDACIÓN EMAIL / TEL
  // =========================
  contactoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tipo = control.get('tipo')?.value;
      const valor = control.get('valor')?.value;

      if (!valor) return null;

      if (tipo === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(valor)
          ? null
          : { emailInvalido: true };
      }

      if (tipo === 'telefono') {
        const phoneRegex = /^[0-9+\-\s]{6,20}$/;
        return phoneRegex.test(valor)
          ? null
          : { telefonoInvalido: true };
      }

      return null;
    };
  }

  // =========================
  // VALIDAR DUPLICADOS
  // =========================
  noDuplicadosContactos(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const contactos = (formArray.value || []) as ContactoCliente[];

      const vistos = new Set<string>();

      for (const c of contactos) {
        const key = `${c.tipo}-${c.valor}`;

        if (vistos.has(key)) {
          return { duplicados: true };
        }

        vistos.add(key);
      }

      return null;
    };
  }

  // =========================
  // CRUD CONTACTOS
  // =========================
  agregarContacto() {
    this.contactos.push(this.crearContacto());
  }

  eliminarContacto(index: number) {
    this.contactos.removeAt(index);
  }

  // =========================
  // CARGAR CLIENTE
  // =========================
  cargarCliente(id: number): void {
    this.loading.set(true);

    this.clientesService.getById(id).subscribe({
      next: (cliente) => {
        this.form.patchValue({
          nombre: cliente.nombre,
        });

        this.contactos.clear();

        cliente.contactos?.forEach((c) => {
          this.contactos.push(
            this.crearContacto(
              c.tipo,
              c.valor,
              c.etiqueta || '',
            ),
          );
        });

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el cliente',
        });
      },
    });
  }

  // =========================
  // GUARDAR
  // =========================
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const payload: Partial<Cliente> = {
      nombre: this.form.value.nombre ?? '',
      contactos: (this.form.value.contactos ?? []) as ContactoCliente[],
    };

    const request$ = this.editando()
      ? this.clientesService.update(this.clienteId()!, payload)
      : this.clientesService.create(payload);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.editando()
            ? 'Cliente actualizado'
            : 'Cliente creado',
          detail: 'Operación exitosa',
        });

        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 1200);
      },
      error: (err) => {
        this.saving.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'Error en la operación',
        });
      },
    });
  }

  // =========================
  // CANCELAR
  // =========================
  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
