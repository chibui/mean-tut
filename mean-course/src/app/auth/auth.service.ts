import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatusLister = new Subject<boolean>();
  private baseURL: string = 'http://localhost:3000/api/user/';
  private isAuthenticated: boolean = false;
  private token: string;
  private tokenTimer: any;

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
    }
  }

  createUser(email:string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post(`${this.baseURL}signup`, authData)
      .subscribe(response => {
        console.log('response', response);
      });
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

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post<{expiresIn: number, token: string}>(`${this.baseURL}login`, authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusLister.next(true);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.authStatusLister.next(false);
    this.isAuthenticated = false;
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private setAuthTimer(expiresInDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  private getAuthData() {
    const expirationDate = localStorage.getItem('expiration');
    const token = localStorage.getItem('token');

    if (!expirationDate || !token) {
      return;
    }

    return {
      expirationDate: new Date(expirationDate),
      token: token
    };
  }
}
