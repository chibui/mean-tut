import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading: boolean = false;

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    const { email, password } = form.value;

    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(email, password);
  }
}
