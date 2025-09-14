import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '@supabase/supabase-js';

export interface LoginForm {
  email: FormControl<string>,
  password: FormControl<string>,
  name: FormControl<string>
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder)

  private authService: AuthService = inject(AuthService)

  private router: Router = inject(Router)

  isLoginMode = true;
  
  isLoading = false;

  public userLoginForm: FormGroup<LoginForm> = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control(''),
    name: this.fb.control(''),
  })

  onSubmit(): void {
    if (this.isLoading) return;
    const rawUserForm = this.userLoginForm.getRawValue()
    this.isLoading = true;

    const authObservable = this.isLoginMode
      ? this.authService.login(rawUserForm.email, rawUserForm.password)
      : this.authService.register(rawUserForm.email, rawUserForm.password, rawUserForm.name);

    authObservable.subscribe(() =>{
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
    });
  }
}