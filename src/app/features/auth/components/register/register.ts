// src/app/features/auth/components/register.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

// Validateur personnalisé pour la confirmation de mot de passe
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value !== confirmPassword?.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Add test method
  testInterceptor() {
    console.log('🧪 Testing interceptor...');

    // Test 1: Without token (should NOT add Authorization header)
    this.http.get('https://httpbin.org/get').subscribe({
      next: (response) => console.log('✅ Response without token:', response),
      error: (error) => console.log('❌ Error without token:', error),
    });

    // Test 2: With token (should add Authorization header)
    // First login to have a token
    this.authService.login({ email: 'admin@example.com', password: 'admin123' }).then(() => {
      this.http.get('https://httpbin.org/get').subscribe({
        next: (response) => console.log('✅ Response with token:', response),
        error: (error) => console.log('❌ Error with token:', error),
      });
    });
  }

  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string>('');

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set('');
      const { name, email, password, confirmPassword } = this.registerForm.value;
      const userData = { name, email, password, confirmPassword };
      this.authService
        .register(userData)
        .then((result) => {
          if (result.success && result.user) {
            this.loading.set(false);
            this.router.navigate(['/todos']);
          } else {
            this.error.set(result.error || 'Erreur lors de la création du compte');
          }
        })
        .catch((err) => {
          this.loading.set(false);
          this.error.set(err.message || 'Erreur lors de la création du compte');
        });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return "Format d'email invalide";
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }
}
