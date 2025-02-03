import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  private routerSub!: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.authService.isLoggedIn().subscribe((status) => {
          this.loggedIn = status;
          console.log('NavigationEnd: login status is', status);
        });
      }
    });

    this.authService.isLoggedIn().subscribe((status) => {
      this.loggedIn = status;
      console.log('Header init: login status is', status);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  login(): void {
    window.location.href = 'http://localhost:8080/auth/google';
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn = false;
  }
}
