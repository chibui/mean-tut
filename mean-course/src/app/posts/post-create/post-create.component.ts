import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredContent = '';
  enteredTitle = '';
  post: Post;
  private mode = 'create';
  private postId: string;

  constructor(
    public route: ActivatedRoute,
    public postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.post = {
              content: postData.content,
              id: postData._id,
              title: postData.title,
            };
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) { return };

    this.mode === 'create'
      ? this.postsService.addPost(form.value.content, form.value.title)
      : this.postsService.updatePost(form.value.content, this.postId, form.value.title);

    form.resetForm();
  }
}
