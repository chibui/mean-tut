import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { ErrorComponent } from './error/error/error.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    PostCreateComponent,
    PostsComponent,
    PostListComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor,
      multi: true
  }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
