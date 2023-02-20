import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { response } from "express";
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
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          this.isAuthenticated = true;
          this.authStatusLister.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.authStatusLister.next(false);
    this.isAuthenticated = false;
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
}
