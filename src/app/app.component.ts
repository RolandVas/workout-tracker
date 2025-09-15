import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentRoute = '';
  showNavigation = true;

  private supabaseService: SupabaseService = inject(SupabaseService)

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
      this.supabaseService.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          this.authService.currentUser.set({
            email: session?.user.email!,
            createdAt: session?.user.created_at!,
            id: session?.user.id!,
            name: session?.user.identities?.at(0)?.identity_data?.['name'],
        })
        } else if (event === 'SIGNED_OUT') {
          this.authService.currentUser.set(null)
        }
      })



    // Check initial route
    this.updateNavigationVisibility(this.router.url);

    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.updateNavigationVisibility(event.url);
      }
    });

    // Check authentication status on app init
    if (!this.authService.isLoggedIn && this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  private updateNavigationVisibility(url: string): void {
    // this.showNavigation = this.authService.isLoggedIn && url !== '/login';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
