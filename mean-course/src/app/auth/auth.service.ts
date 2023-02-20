import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { response } from "express";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatusLister = new Subject<boolean>();
  private baseURL: string = 'http://localhost:3000/api/user/';
  private isAuthenticated: boolean = false;
  private token: string;

  constructor(private http: HttpClient) {}

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

    this.http.post<{token: string}>(`${this.baseURL}login`, authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;

        if (token) {
          this.isAuthenticated = true;
          this.authStatusLister.next(true);
        }
      });
  }
}
