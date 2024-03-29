import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy, OnInit {
  userIsAuthenticated: boolean = false;

  private authListerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListerSubs = this.authService
      .getAuthStatusListener()
      .subscribe({
        next: (isAuthenticated) => this.userIsAuthenticated = isAuthenticated,
        error: (error) => console.log('error', error)
      });
  }

  ngOnDestroy(): void {
    this.authListerSubs.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
