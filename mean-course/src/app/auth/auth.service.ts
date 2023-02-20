import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { response } from "express";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseURL = 'http://localhost:3000/api/user/';
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

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post(`${this.baseURL}login`, authData)
      .subscribe(response => {
        console.log(response);
      });
  }
}
