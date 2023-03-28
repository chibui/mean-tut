import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";

const BASE_URL = `${environment.apiUrl}/user/`;
@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatusLister = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusLister.next(true);
      this.userId = authInformation.userId;
    }
  }

  createUser(email:string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post(`${BASE_URL}signup`, authData)
    .subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.authStatusLister.next(false);
      }
    });;
  }

  getAuthStatusListener() {
    return this.authStatusLister.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post<{ expiresIn: number, token: string, userId: string }>(`${BASE_URL}login`, authData)
      .subscribe({
        next: (response) => {
          const token = response.token;
          this.token = token;

          if (token) {
            const expiresInDuration = response.expiresIn;
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusLister.next(true);
            this.userId = response.userId;
            this.saveAuthData(expirationDate, token, this.userId);
            this.router.navigate(['/']);
          }
        },
        error: () => this.authStatusLister.next(false)
      });
  }

  logout() {
    this.authStatusLister.next(false);
    this.isAuthenticated = false;
    this.token = null;
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private clearAuthData() {
    localStorage.removeItem('expiration');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  private saveAuthData(expirationDate: Date, token: string, userId: string) {
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }

  private setAuthTimer(expiresInDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  private getAuthData() {
    const expirationDate = localStorage.getItem('expiration');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!expirationDate || !token) {
      return;
    }

    return {
      expirationDate: new Date(expirationDate),
      token: token,
      userId: userId
    };
  }
}
