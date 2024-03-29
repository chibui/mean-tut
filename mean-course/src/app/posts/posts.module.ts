import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostsComponent } from './posts.component';
import { PostListComponent } from './post-list/post-list.component';

import { AngularMaterialModule } from '../angular-material/angular-material.module';


@NgModule({
  declarations: [
    PostCreateComponent,
    PostsComponent,
    PostListComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class PostsModule { }
