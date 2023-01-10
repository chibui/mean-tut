import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private post: Post;
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
        this.post = this.postsService.getPost(this.postId);
      } else {
        this.mode = 'create';
        this.postId = paramMap.get('postId');
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) { return };

    const post: Post = {
      content: form.value.content,
      id: null,
      title: form.value.title
    }

    this.postsService.addPost(post);
    form.resetForm();
  }
}
