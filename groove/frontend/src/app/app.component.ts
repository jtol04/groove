import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styles: [`
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 60px;
      background: #0a0a12;
      border-bottom: 1px solid #1a1a2e;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .logo {
      font-size: 1.4rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.04em;
      user-select: none;
    }

    .logo .accent {
      color: #8b5cf6;
    }

    .nav-links {
      display: flex;
      gap: 0.25rem;
    }

    .nav-links a {
      color: #64748b;
      text-decoration: none;
      padding: 0.4rem 0.9rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.15s, background 0.15s;
    }

    .nav-links a:hover {
      color: #f8fafc;
      background: #1a1a2e;
    }

    .nav-links a.active {
      color: #f8fafc;
      background: #1e1b4b;
    }
  `],
  template: `
    <nav>
      <div class="logo">gr<span class="accent">♪</span>ove</div>
      <div class="nav-links">
        <a routerLink="/swipe" routerLinkActive="active">Discover</a>
        <a routerLink="/recommendations" routerLinkActive="active">For You</a>
      </div>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}
