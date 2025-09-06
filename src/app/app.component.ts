import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentRoute = '';
  showNavigation = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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

  private updateNavigationVisibility(url: string): void {
    this.showNavigation = this.authService.isLoggedIn && url !== '/login';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
