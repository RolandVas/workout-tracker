import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoginMode = true;
  isLoading = false;
  formData = {
    email: '',
    password: '',
    name: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    const authObservable = this.isLoginMode
      ? this.authService.login(this.formData.email, this.formData.password)
      : this.authService.register(this.formData.email, this.formData.password, this.formData.name);

    authObservable.subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}